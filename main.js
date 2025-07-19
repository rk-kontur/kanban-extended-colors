const { Plugin, PluginSettingTab, Setting } = require("obsidian");

module.exports = class KanbanSettingsPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new KanbanSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(() => this.colorize());
    this.observeDom();
  }

  onunload() {
    const els = document.querySelectorAll(`
      .kanban-plugin__item,
      .kanban-plugin__item-title-wrapper,
      .kanban-plugin__item-metadata-wrapper,
      .kanban-plugin__lane,
      .kanban-plugin__lane-items,
      .kanban-plugin__item-button-wrapper,
      .kanban-plugin__item-button-wrapper button
    `);
    els.forEach(el => el.removeAttribute("style"));
  }

  observeDom() {
    new MutationObserver(() => this.colorize()).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  getTagColor(el) {
    const tag = el.querySelector("a.tag");
    if (!tag) return "rgb(128,128,128)";
    return getComputedStyle(tag).backgroundColor || "rgb(128,128,128)";
  }

  toRGBA(col, op) {
    if (!col) return `rgba(0,0,0,${op})`;
    if (col.startsWith("#")) {
      const hex = col.length === 4 ? col.replace(/#/g, "").split("").map(x => x + x).join("") : col.slice(1);
      const int = parseInt(hex, 16);
      const r = (int >> 16) & 255,
        g = (int >> 8) & 255,
        b = int & 255;
      return `rgba(${r},${g},${b},${op})`;
    }

    const m = col.match(/rgba?\s*\(([^)]+)\)/);
    if (!m) return col;

    const comps = m[1].split(",").map(x => parseFloat(x.trim()));
    const [r, g, b, a = 1] = comps;
    return `rgba(${r},${g},${b},${a * op})`;
  }

  colorize() {
    this.styleLanes();
    this.styleCards();
  }

  styleLanes() {
    document.querySelectorAll(".kanban-plugin__lane").forEach(lane => {
      const header = lane.querySelector(".kanban-plugin__lane-header-wrapper");
      const content = lane.querySelector(".kanban-plugin__lane-items");
      const buttonWrapper = lane.querySelector(".kanban-plugin__item-button-wrapper");
      const button = buttonWrapper?.querySelector("button");
      if (!header || !content || !buttonWrapper || !button) return;

      const tagCol = this.getTagColor(header);

      const borderCol = this.toRGBA(
        this.settings.customLaneBorderColor || (this.settings.useLaneTagColors ? tagCol : "#000"),
        this.settings.laneBorderOpacity,
      );
      const headerBg = this.toRGBA(tagCol, this.settings.laneBgOpacity);
      const contentBg = this.toRGBA(tagCol, this.settings.laneContentBgOpacity);
      const btnBg = this.toRGBA(tagCol, this.settings.laneButtonBgOpacity);
      const btnBorder = this.toRGBA(
        this.settings.customLaneBorderColor || tagCol,
        this.settings.laneButtonBorderOpacity,
      );

      lane.style.setProperty("border", `${this.settings.laneBorderWidth}px solid ${borderCol}`, "important");
      header.style.setProperty("background-color", headerBg, "important");
      content.style.setProperty("background-color", contentBg, "important");

      buttonWrapper.style.setProperty("background-color", contentBg, "important");
      button.style.setProperty("background-color", btnBg, "important");
      button.style.setProperty("border", `${this.settings.laneButtonBorderWidth}px solid ${btnBorder}`, "important");
      button.style.setProperty("border-radius", "6px", "important");

      // Höhe anwenden
      if (this.settings.laneMaxHeightPercent > 0) {
        lane.style.setProperty("max-height", `${this.settings.laneMaxHeightPercent}vh`, "important");
      } else {
        lane.style.setProperty("max-height", `${this.settings.laneMaxHeightPx}px`, "important");
      }
      lane.style.setProperty("overflow-y", "auto", "important");
    });
  }

  styleCards() {
    document.querySelectorAll(".kanban-plugin__item").forEach(card => {
      const header = card.querySelector(".kanban-plugin__item-title-wrapper");
      const body = card.querySelector(".kanban-plugin__item-metadata-wrapper");
      if (!header || !body) return;

      const tagCol = this.getTagColor(header);

      const borderCol = this.toRGBA(
        this.settings.customBorderColor || (this.settings.useTagColors ? tagCol : "#000"),
        this.settings.cardBorderOpacity,
      );
      const headerBg = this.toRGBA(tagCol, this.settings.cardHeaderOpacity);
      const bodyBg = this.toRGBA(tagCol, this.settings.cardBodyOpacity);

      card.style.setProperty("border", `${this.settings.cardBorderWidth}px solid ${borderCol}`, "important");
      card.style.setProperty("border-radius", "6px", "important");

      header.style.setProperty("background-color", headerBg, "important");
      body.style.setProperty("background-color", bodyBg, "important");
    });
  }

  async loadSettings() {
    this.settings = Object.assign(
      {
        laneBorderWidth: 2,
        laneBorderOpacity: 1.0,
        laneBgOpacity: 0.2,
        laneContentBgOpacity: 0.1,
        laneButtonBgOpacity: 0.1,
        laneButtonBorderOpacity: 0.5,
        laneButtonBorderWidth: 1,
        customLaneBorderColor: "",
        useLaneTagColors: true,

        laneMaxHeightPercent: 100,
        laneMaxHeightPx: 600,

        cardBorderWidth: 2,
        cardBorderOpacity: 1.0,
        cardHeaderOpacity: 0.5,
        cardBodyOpacity: 0.2,
        customBorderColor: "",
        useTagColors: true,
      },
      await this.loadData(),
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
};

class KanbanSettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.lang = localStorage.getItem("language")?.startsWith("de") ? "de" : "en";
  }

  t(de, en) {
    return this.lang === "de" ? de : en;
  }

  display() {
    const c = this.containerEl;
    c.empty();
    c.createEl("h2", { text: this.t("Kanban Settings – Einstellungen", "Kanban Settings – Settings") });

    c.createEl("h3", { text: this.t("Spalte", "Lane") });
    this.slider(c, "laneBorderWidth", this.t("Breite Spaltenrahmen", "Lane border width"), 0, 10, 1);
    this.slider(c, "laneBorderOpacity", this.t("Deckkraft Spaltenrahmen", "Lane border opacity"));
    this.slider(c, "laneBgOpacity", this.t("Deckkraft Hintergrund Spaltenkopf", "Lane header background opacity"));
    this.slider(c, "laneContentBgOpacity", this.t("Deckkraft Hintergrund Spalteninhalt", "Lane content background opacity"));
    this.slider(c, "laneButtonBgOpacity", this.t('Deckkraft Hintergrund Knopf "Füge eine Karte hinzu"', 'Button background opacity'));
    this.slider(c, "laneButtonBorderWidth", this.t('Breite Rahmen Knopf "Füge eine Karte hinzu"', 'Button border width'), 0, 5, 1);
    this.slider(c, "laneButtonBorderOpacity", this.t('Deckkraft Rahmen Knopf "Füge eine Karte hinzu"', 'Button border opacity'));

    this.toggle(c, "useLaneTagColors", this.t("Farben aus Tags", "Use tag colors"), "customLaneBorderColor");
    this.color(c, "customLaneBorderColor", this.t("Eigene Rahmenfarbe", "Custom border color"), "useLaneTagColors");

    c.createEl("h3", { text: this.t("Karten", "Cards") });
    this.slider(c, "cardBorderWidth", this.t("Breite Kartenrahmen", "Card border width"), 0, 10, 1);
    this.slider(c, "cardBorderOpacity", this.t("Deckkraft Rahmen Karten", "Card border opacity"));
    this.slider(c, "cardHeaderOpacity", this.t("Deckkraft Hintergrund Kartenkopf", "Card header background opacity"));
    this.slider(c, "cardBodyOpacity", this.t("Deckkraft Hintergrund Karteninhalt", "Card body background opacity"));
    this.toggle(c, "useTagColors", this.t("Farben aus Tags", "Use tag colors"), "customBorderColor");
    this.color(c, "customBorderColor", this.t("Eigene Rahmenfarbe", "Custom border color"), "useTagColors");
  }

  slider(parent, key, name, min = 0, max = 1, step = 0.01) {
    new Setting(parent)
      .setName(name)
      .addSlider(slider =>
        slider
          .setLimits(min, max, step)
          .setValue(this.plugin.settings[key])
          .setDynamicTooltip()
          .onChange(async v => {
            this.plugin.settings[key] = v;
            await this.plugin.saveSettings();
            this.plugin.colorize();
          }),
      );
  }

  toggle(parent, key, name, disableIf) {
    new Setting(parent)
      .setName(name)
      .addToggle(t =>
        t
          .setValue(this.plugin.settings[key])
          .onChange(async v => {
            this.plugin.settings[key] = v;
            if (v) this.plugin.settings[disableIf] = "";
            await this.plugin.saveSettings();
            this.display();
            this.plugin.colorize();
          }),
      );
  }

  color(parent, key, name, disableIf) {
    new Setting(parent)
      .setName(name)
      .addColorPicker(picker =>
        picker
          .setValue(this.plugin.settings[key] || "#000000")
          .onChange(async v => {
            this.plugin.settings[key] = v;
            this.plugin.settings[disableIf] = false;
            await this.plugin.saveSettings();
            this.display();
            this.plugin.colorize();
          }),
      );
  }
}

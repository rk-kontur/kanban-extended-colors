# Kanban Extended Colors

This plugin extends the capabilities of two Obsidian plugins:

1. Kanban https://github.com/mgmeyers/obsidian-kanban
2. Colored Tags Wrangler https://github.com/code-of-chaos/obsidian-colored_tags_wrangler

## What the other two plugins do

1. **Kanban** allows Obsidian unsers to create Kanban lanes and cards. They can hold tasks that can be ticked off or content that can be rearranged by drag and drop. It can also display frontmatter content inside the cards.
2. **Colored Tags Wrangler** allows to define colors based on tags. These can then be used in Kanban and a few other areas of Obsidian.

## What this plugin adds

It enables control over the colors of both kanban columns and cards and applies the values defined for tags in Colored Tags Wrangler onto Kanban items. There are a number of settings that can be adjusted directly in the plugin. This is what results may look like:

<img width="785" height="382" alt="grafik" src="https://github.com/user-attachments/assets/5ac497df-1d97-4b66-92d9-adae1d3f21f5" />

The settings include two different areas of color-application: Lanes and cards:

## Lanes

<img width="1070" height="629" alt="grafik" src="https://github.com/user-attachments/assets/a8669639-b3f5-49a0-8804-a96a1d661ad9" />

Here, you can define:

1. **Lane border width**: How thick your lane border will be
2. **Lane border opacity**: The amount of the tags color that is applied to the lane border
3. **Lane header background opacity**: The amount of the tags color that is applied to the Lane header
4. **Lane content background opacity**: The amount of the tags color that is applied to the lane background
5. **Button background opacity**: The amount of the tags color that is applied to the "Adda Card" button at the bottom of the Kanban lane.
6. **Button Border width**: How thick your button border will be
7. **Button Border opacity**: The amount of the tags color that is applied to the button border
8. **Use tag colors**: Colors will only be applied when this switch is enabled
9. **Custom border color**: In case you don't want to use custom colors, you vcan define one here that will be applied wo all lane borders

## Cards

<img width="1081" height="462" alt="grafik" src="https://github.com/user-attachments/assets/462b1809-371d-49be-9dac-429b8654138d" />


1. **Card border width**: How thick your card border will be
2. **Card border opacity**: The amount of the tags color that is applied to the card border
3. **Card header background opacity**: The amount of the tags color that is applied to the card header
4. **Card body background opacity**: The amount of the tags color that is applied to the card body
5. **Use tag colors**: Colors will only be applied when this switch is enabled
6. **Custom border color**: In case you don't want to use custom colors, you vcan define one here that will be applied wo all card borders

## Notes

### Coloring Cards

<img width="385" height="312" alt="grafik" src="https://github.com/user-attachments/assets/43d60388-a205-46b5-9fe4-10d4b0da5163" />


In order to color a card - example: first card in green lane - you need to add an empty line between content and tag. Like this:
If you do't do this, your card will nozt be colored, onyly the colored tag will be displayed - example: second card in green lane.

Card congtent without color:

```
Card with tag but without empty line
#color3
```

Card content with color:

```
Card without Metadata

#color3
```

### Header and body

In order to see card body and header, you will need to use notes linked to your cards  **and** display at least content from one of its properties from YAML. To give you an example:

<img width="387" height="370" alt="grafik" src="https://github.com/user-attachments/assets/8727e537-0d49-4ea3-99d0-ccd33c1aa1de" />

This card displays a tag from the linked note. It looks like this:

<img width="353" height="255" alt="grafik" src="https://github.com/user-attachments/assets/71868f42-2ab2-48a3-be82-3acad3a63348" />

## Use Case: Writing

I personally use the combination of **Kanban** and **Colored Tags Wrangler** for my writing projects. This is an example of my Kanban for a longform story (content is garbled but you can see structure and colors of the Kanban):

<img width="3609" height="2131" alt="grafik" src="https://github.com/user-attachments/assets/d813cb93-a836-44e7-aec3-4f7c0f732511" />

I created this plugin for seeing the tags colors more easily and clearly. It helps me a lot with my workflow and I thought it might maybe help others.

## Supported Languages

- English
- German

## Supported Operating Systems

- Windows
- Android


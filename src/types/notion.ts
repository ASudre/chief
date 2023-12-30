export type MultiSelectProperty = {
  id: string,
  type: "multi_select",
  multi_select: Array<
    {
      id: string,
      name: string,
      color: string,
    }
  >
}

export type NumberProperty = {
  id: string,
  type: "number",
  number: number
};

export type TitleProperty = {
  id: "title",
  type: "title",
  title: Array<
    {
      type: "text",
      text: {
        content: string,
        link: null
      },
      annotations: {
        bold: boolean,
        italic: boolean,
        strikethrough: boolean,
        underline: boolean,
        code: boolean,
        color: string
      },
      plain_text: string,
    }
  >
}

export type Property = MultiSelectProperty | NumberProperty | TitleProperty

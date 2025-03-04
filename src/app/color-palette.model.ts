export interface ColorPalette {
  name: string;
  colors: {
    icon: string;
    text: string;
    line: string;
  };
  style: {
    font: string;
  };
}

export interface ColorPalettes {
  'color-palettes': ColorPalette[];
}

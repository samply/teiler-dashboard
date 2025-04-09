export interface ColorPalette {
  name: string;
  colors: {
    icon: string;
    text: string;
    line: string;
    background: string;
  };
  style: {
    font: string;
  };
}

export interface ColorPalettes {
  'color-palettes': ColorPalette[];
}

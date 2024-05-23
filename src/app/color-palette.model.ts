export interface ColorPalette {
  name: string;
  colors: {
    icon: string;
    background: string;
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

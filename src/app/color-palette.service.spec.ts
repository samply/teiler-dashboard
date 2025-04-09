import { TestBed } from '@angular/core/testing';
import { StylingService } from './styling.service';
import { ColorPalette, ColorPalettes } from './color-palette.model';
import * as data from '../assets/color-palettes.json';
import { environment } from '../environments/environment';

describe('ColorPaletteService', () => {
  let service: StylingService;
  const mockPalettes: ColorPalettes = (data as any).default;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load color palettes on initialization', () => {
    spyOn(console, 'log');
    service = new StylingService();
    expect(console.log).toHaveBeenCalledWith('loadColorPalettes method called');
    expect(service['colorPalettes']).toEqual(jasmine.objectContaining(mockPalettes['color-palettes'].reduce((acc: { [key: string]: ColorPalette }, palette: ColorPalette) => {
      acc[palette.name] = palette;
      return acc;
    }, {})));
    expect(console.log).toHaveBeenCalledWith('Color palettes loaded successfully:', service['colorPalettes']);
  });

  it('should set palettesLoaded$ to true after loading palettes', () => {
    service = new StylingService();
    expect(service.getPalettesLoadedStatus().getValue()).toBe(true);
  });

  it('should select palette specified in environment configuration', () => {
    service = new StylingService();
    const paletteName = environment.config.COLOR_PALETTE;
    expect(service.getSelectedPaletteName()).toBe(paletteName);
  });

  it('should return font style of selected palette', () => {
    const mockPalette: ColorPalette = mockPalettes['color-palettes'][0];
    service.selectPalette(mockPalette.name);
    expect(service.getFontStyle()).toBe(mockPalette.style.font);
  });

  it('should return default color if no palette is selected when getting font style', () => {
    expect(service.getFontStyle()).toBe('defaultColor');
  });

  it('should return background color of selected palette', () => {
    const mockPalette: ColorPalette = mockPalettes['color-palettes'][0];
    service.selectPalette(mockPalette.name);
    expect(service.getBackgroundColor()).toBe(mockPalette.colors.background);
  });

  it('should return default color if no palette is selected when getting background color', () => {
    expect(service.getBackgroundColor()).toBe('defaultColor');
  });

  it('should return text color of selected palette', () => {
    const mockPalette: ColorPalette = mockPalettes['color-palettes'][0];
    service.selectPalette(mockPalette.name);
    expect(service.getTextColor()).toBe(mockPalette.colors.text);
  });

  it('should return default color if no palette is selected when getting text color', () => {
    expect(service.getTextColor()).toBe('defaultColor');
  });

  it('should return line color of selected palette', () => {
    const mockPalette: ColorPalette = mockPalettes['color-palettes'][0];
    service.selectPalette(mockPalette.name);
    expect(service.getLineColor()).toBe(mockPalette.colors.line);
  });

  it('should return default color if no palette is selected when getting line color', () => {
    expect(service.getLineColor()).toBe('defaultColor');
  });

  it('should return icon color of selected palette', () => {
    const mockPalette: ColorPalette = mockPalettes['color-palettes'][0];
    service.selectPalette(mockPalette.name);
    expect(service.getIconColor()).toBe(mockPalette.colors.icon);
  });

  it('should return default color if no palette is selected when getting icon color', () => {
    expect(service.getIconColor()).toBe('defaultColor');
  });
});

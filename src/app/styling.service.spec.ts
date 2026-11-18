import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NEVER, of, throwError } from 'rxjs';
import { StylingService } from './styling.service';
import { ColorPalettes } from './color-palette.model';
import { DashboardConfigService } from './teiler/dashboard-config.service';
import { environment } from '../environments/environment';
import * as localData from '../assets/color-palettes.json';

describe('StylingService', () => {
  let configService: jasmine.SpyObj<DashboardConfigService>;
  const originalColorProfile = environment.config.COLOR_PROFILE;

  const serverPalettes: ColorPalettes = {
    'color-palettes': [{
      name: 'Server',
      colors: { icon: '#111', text: '#222', line: '#333', background: '#444' },
      style: { font: 'Arial' },
    }],
  };

  const createService = () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DashboardConfigService, useValue: configService },
      ],
    });
    return TestBed.inject(StylingService);
  };

  beforeEach(() => {
    configService = jasmine.createSpyObj<DashboardConfigService>('DashboardConfigService', ['getStyle', 'getColorPalettes']);
  });

  afterEach(() => environment.config.COLOR_PROFILE = originalColorProfile);

  it('should select the palette named in the style from the server palettes', () => {
    configService.getStyle.and.returnValue(of({ useColorProfile: 'Server', font: 'Roboto' }));
    configService.getColorPalettes.and.returnValue(of(serverPalettes));

    const service = createService();

    expect(service.getStyleLoadedStatus().getValue()).toBeTrue();
    expect(service.getPalettesLoadedStatus().getValue()).toBeTrue();
    expect(service.getSelectedPaletteName()).toBe('Server');
    expect(service.getTextColor()).toBe('#222');
    expect(service.getBackgroundColor()).toBe('#444');
    expect(service.getFontStyle()).toBe('Roboto');
  });

  it('should fall back to the bundled palettes when the server palettes cannot be loaded', () => {
    const localName = (localData as any).default['color-palettes'][1].name;
    environment.config.COLOR_PROFILE = localName;
    configService.getStyle.and.returnValue(NEVER);
    configService.getColorPalettes.and.returnValue(throwError(() => new Error('offline')));
    spyOn(console, 'error');
    spyOn(console, 'log');

    const service = createService();

    expect(service.getSelectedPaletteName()).toBe(localName);
    expect(service.getPalettesLoadedStatus().getValue()).toBeTrue();
  });

  it('should return default colors while no palette is selected', () => {
    configService.getStyle.and.returnValue(NEVER);
    configService.getColorPalettes.and.returnValue(NEVER);

    const service = createService();

    expect(service.getSelectedPaletteName()).toBeNull();
    expect(service.getTextColor()).toBe('defaultColor');
    expect(service.getBackgroundColor()).toBe('#ffffff');
  });
});

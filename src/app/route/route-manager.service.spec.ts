import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteManagerService } from './route-manager.service';
import { TeilerService } from '../teiler/teiler.service';
import { TeilerApp } from '../teiler/teiler-app';

describe('RoutesManagerService', () => {
  let service: RouteManagerService;
  let teilerApps$: Subject<TeilerApp[]>;

  beforeEach(() => {
    teilerApps$ = new Subject<TeilerApp[]>();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeilerService, useValue: { followTeilerApps: () => teilerApps$ } },
      ],
    });
    service = TestBed.inject(RouteManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset the router config when the teiler apps change', () => {
    const router = TestBed.inject(Router);
    const resetConfig = spyOn(router, 'resetConfig').and.callThrough();
    teilerApps$.next([]);
    expect(resetConfig).toHaveBeenCalled();
  });
});

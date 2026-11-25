import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { TeilerAuthService } from './teiler-auth.service';
import { environment } from '../../environments/environment';

describe('TeilerAuthService', () => {
  let service: TeilerAuthService;
  let userData$: BehaviorSubject<any>;
  const originalTokenGroup = environment.config.OIDC_TOKEN_GROUP;

  beforeEach(() => {
    userData$ = new BehaviorSubject<any>({ userData: null });
    TestBed.configureTestingModule({
      providers: [{ provide: OidcSecurityService, useValue: { userData$ } }],
    });
    service = TestBed.inject(TeilerAuthService);
  });

  afterEach(() => environment.config.OIDC_TOKEN_GROUP = originalTokenGroup);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the roles claim or an empty list', async () => {
    expect(await service.getRoles()).toEqual([]);
    userData$.next({ userData: { roles: ['admin'] } });
    expect(await service.getRoles()).toEqual(['admin']);
  });

  it('should read groups from the configured claim and strip a leading slash', async () => {
    environment.config.OIDC_TOKEN_GROUP = 'my-groups';
    userData$.next({ userData: { 'my-groups': ['/bh-user', 'bh-admin'] } });
    expect(await service.getGroups()).toEqual(['bh-user', 'bh-admin']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NavigationPortalService } from '../service/navigation-portal.service';

import { NavigationPortalComponent } from './navigation-portal.component';

describe('NavigationPortal Management Component', () => {
  let comp: NavigationPortalComponent;
  let fixture: ComponentFixture<NavigationPortalComponent>;
  let service: NavigationPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'navigation-portal', component: NavigationPortalComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [NavigationPortalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(NavigationPortalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NavigationPortalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NavigationPortalService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.navigationPortals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to navigationPortalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getNavigationPortalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getNavigationPortalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

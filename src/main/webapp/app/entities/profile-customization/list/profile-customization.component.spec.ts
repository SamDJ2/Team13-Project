import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfileCustomizationService } from '../service/profile-customization.service';

import { ProfileCustomizationComponent } from './profile-customization.component';

describe('ProfileCustomization Management Component', () => {
  let comp: ProfileCustomizationComponent;
  let fixture: ComponentFixture<ProfileCustomizationComponent>;
  let service: ProfileCustomizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'profile-customization', component: ProfileCustomizationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ProfileCustomizationComponent],
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
      .overrideTemplate(ProfileCustomizationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfileCustomizationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProfileCustomizationService);

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
    expect(comp.profileCustomizations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to profileCustomizationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProfileCustomizationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProfileCustomizationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

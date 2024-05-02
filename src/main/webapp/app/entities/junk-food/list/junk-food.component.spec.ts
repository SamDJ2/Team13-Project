import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JunkFoodService } from '../service/junk-food.service';

import { JunkFoodComponent } from './junk-food.component';

describe('JunkFood Management Component', () => {
  let comp: JunkFoodComponent;
  let fixture: ComponentFixture<JunkFoodComponent>;
  let service: JunkFoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'junk-food', component: JunkFoodComponent }]), HttpClientTestingModule],
      declarations: [JunkFoodComponent],
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
      .overrideTemplate(JunkFoodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JunkFoodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JunkFoodService);

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
    expect(comp.junkFoods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to junkFoodService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJunkFoodIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJunkFoodIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

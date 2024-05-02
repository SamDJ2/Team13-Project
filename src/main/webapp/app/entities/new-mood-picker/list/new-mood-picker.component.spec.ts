import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NewMoodPickerService } from '../service/new-mood-picker.service';

import { NewMoodPickerComponent } from './new-mood-picker.component';

describe('NewMoodPicker Management Component', () => {
  let comp: NewMoodPickerComponent;
  let fixture: ComponentFixture<NewMoodPickerComponent>;
  let service: NewMoodPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'new-mood-picker', component: NewMoodPickerComponent }]), HttpClientTestingModule],
      declarations: [NewMoodPickerComponent],
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
      .overrideTemplate(NewMoodPickerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewMoodPickerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NewMoodPickerService);

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
    expect(comp.newMoodPickers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to newMoodPickerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getNewMoodPickerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getNewMoodPickerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

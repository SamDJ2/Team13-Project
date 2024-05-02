import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PromptsPageService } from '../service/prompts-page.service';

import { PromptsPageComponent } from './prompts-page.component';

describe('PromptsPage Management Component', () => {
  let comp: PromptsPageComponent;
  let fixture: ComponentFixture<PromptsPageComponent>;
  let service: PromptsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'prompts-page', component: PromptsPageComponent }]), HttpClientTestingModule],
      declarations: [PromptsPageComponent],
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
      .overrideTemplate(PromptsPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromptsPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PromptsPageService);

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
    expect(comp.promptsPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to promptsPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPromptsPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPromptsPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChallengesService } from '../service/challenges.service';

import { ChallengesComponent } from './challenges.component';

describe('Challenges Management Component', () => {
  let comp: ChallengesComponent;
  let fixture: ComponentFixture<ChallengesComponent>;
  let service: ChallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'challenges', component: ChallengesComponent }]), HttpClientTestingModule],
      declarations: [ChallengesComponent],
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
      .overrideTemplate(ChallengesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChallengesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChallengesService);

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
    expect(comp.challenges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to challengesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChallengesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChallengesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

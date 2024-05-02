import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociaLevelsComponent } from './socia-levels.component';

describe('SociaLevelsComponent', () => {
  let component: SociaLevelsComponent;
  let fixture: ComponentFixture<SociaLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SociaLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SociaLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialStartComponent } from './social-start.component';

describe('SocialStartComponent', () => {
  let component: SocialStartComponent;
  let fixture: ComponentFixture<SocialStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

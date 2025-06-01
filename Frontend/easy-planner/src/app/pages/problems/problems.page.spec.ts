import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProblemsPage } from './problems.page';

describe('ProblemsPage', () => {
  let component: ProblemsPage;
  let fixture: ComponentFixture<ProblemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

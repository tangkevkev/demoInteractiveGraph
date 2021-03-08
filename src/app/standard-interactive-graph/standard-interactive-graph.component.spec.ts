import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardInteractiveGraphComponent } from './standard-interactive-graph.component';

describe('StandardInteractiveGraphComponent', () => {
  let component: StandardInteractiveGraphComponent;
  let fixture: ComponentFixture<StandardInteractiveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardInteractiveGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardInteractiveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

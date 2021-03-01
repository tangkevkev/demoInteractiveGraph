import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveGraphComponent } from './interactive-graph.component';

describe('InteractiveGraphComponent', () => {
  let component: InteractiveGraphComponent;
  let fixture: ComponentFixture<InteractiveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractiveGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

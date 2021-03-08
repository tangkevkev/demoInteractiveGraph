import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInteractiveGraphComponent } from './custom-interactive-graph.component';

describe('CustomInteractiveGraphComponent', () => {
  let component: CustomInteractiveGraphComponent;
  let fixture: ComponentFixture<CustomInteractiveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomInteractiveGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInteractiveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

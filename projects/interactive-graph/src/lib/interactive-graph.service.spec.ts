import { TestBed } from '@angular/core/testing';

import { InteractiveGraphService } from './interactive-graph.service';

describe('InteractiveGraphService', () => {
  let service: InteractiveGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

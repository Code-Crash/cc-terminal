import { TestBed } from '@angular/core/testing';

import { CcTerminalService } from './cc-terminal.service';

describe('CcTerminalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CcTerminalService = TestBed.get(CcTerminalService);
    expect(service).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcTerminalComponent } from './cc-terminal.component';

describe('CcTerminalComponent', () => {
  let component: CcTerminalComponent;
  let fixture: ComponentFixture<CcTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CcTerminalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

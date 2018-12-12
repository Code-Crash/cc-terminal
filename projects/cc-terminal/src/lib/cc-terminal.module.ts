import { NgModule } from '@angular/core';
import { CcTerminalComponent } from './cc-terminal.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [CcTerminalComponent],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  exports: [CcTerminalComponent]
})
export class CcTerminalModule { }

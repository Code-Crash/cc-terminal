import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CcTerminalModule } from '../../projects/cc-terminal/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CcTerminalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

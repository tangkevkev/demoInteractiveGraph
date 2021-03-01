import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InteractiveGraphModule } from 'interactive-graph'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InteractiveGraphModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

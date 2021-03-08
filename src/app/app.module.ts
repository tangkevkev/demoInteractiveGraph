import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InteractiveGraphModule} from 'interactive-graph';
import { AboutComponent } from './about/about.component';
import { CustomInteractiveGraphComponent } from './custom-interactive-graph/custom-interactive-graph.component';
import { StandardInteractiveGraphComponent } from './standard-interactive-graph/standard-interactive-graph.component'

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CustomInteractiveGraphComponent,
    StandardInteractiveGraphComponent
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

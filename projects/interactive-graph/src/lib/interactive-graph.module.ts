import { NgModule } from '@angular/core';
import { InteractiveGraphComponent } from './interactive-graph.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [InteractiveGraphComponent],
  imports: [ BrowserModule
  ],
  exports: [InteractiveGraphComponent]
})
export class InteractiveGraphModule { }

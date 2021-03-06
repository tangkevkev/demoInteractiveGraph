import { NgModule } from '@angular/core';
import { InteractiveGraphComponent } from './interactive-graph.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { CustomInteractiveGraphComponent } from './custom-interactive-graph.component'


@NgModule({
  declarations: [InteractiveGraphComponent, CustomInteractiveGraphComponent],
  imports: [ BrowserModule, FormsModule
  ],
  exports: [InteractiveGraphComponent, CustomInteractiveGraphComponent]
})
export class InteractiveGraphModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomInteractiveGraphComponent } from './custom-interactive-graph/custom-interactive-graph.component'
import { StandardInteractiveGraphComponent } from './standard-interactive-graph/standard-interactive-graph.component'

const routes: Routes = [
    {path: '', component: StandardInteractiveGraphComponent},
    {path: 'custom', component: CustomInteractiveGraphComponent},
    {path: 'standard', component: StandardInteractiveGraphComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeGraphComponent } from './time-graph/time-graph.component';


const applicationRoutes : Routes  = [
  // {path : 'createTG' , component : CreateTimeGraphComponent},
  {path : 'timeGraph' , component : TimeGraphComponent},
  {path : '', redirectTo: '/timeGraph', pathMatch : 'full'}

];
@NgModule({
  imports: [RouterModule.forRoot(applicationRoutes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }

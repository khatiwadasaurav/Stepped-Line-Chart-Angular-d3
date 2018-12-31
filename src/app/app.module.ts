import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { TimeGraphComponent } from './time-graph/time-graph.component';



@NgModule({
  declarations: [
    AppComponent,
    TimeGraphComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

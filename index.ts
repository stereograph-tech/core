import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Api } from 'api';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    Api
  ],
  bootstrap: []
})
export class ApiModule { }
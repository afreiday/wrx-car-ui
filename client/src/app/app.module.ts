import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, WrxOverheadComponent } from './components';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    WrxOverheadComponent
  ],
  bootstrap: [
		AppComponent
  ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, WrxOverheadComponent } from './components';
import { StateService } from './services/state.service';

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
  ],
  providers: [
    StateService
  ]
})
export class AppModule { }

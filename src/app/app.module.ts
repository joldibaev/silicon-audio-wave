import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AudioWaveModule} from "audio-wave";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AudioWaveModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

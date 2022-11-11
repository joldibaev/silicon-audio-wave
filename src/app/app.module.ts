import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {ToTimerPipe} from "./pipes/to-timer.pipe";

import {AudioWaveModule} from "audio-wave";

@NgModule({
  declarations: [
    ToTimerPipe,
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AudioWaveModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

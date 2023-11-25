import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AudioWaveModule} from "../../projects/audio-wave/src/lib/audio-wave.module";
import {ToTimerPipe} from "./pipes/to-timer.pipe";

@NgModule({
  declarations: [
    AppComponent,
    ToTimerPipe
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

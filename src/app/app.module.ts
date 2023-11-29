import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NgxAudioWaveModule} from "../../projects/ngx-audio-wave/src/lib/ngx-audio-wave.module";
import {ToTimerPipe} from "./pipes/to-timer.pipe";

@NgModule({
  declarations: [
    AppComponent,
    ToTimerPipe
  ],
  imports: [
    BrowserModule,
    NgxAudioWaveModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

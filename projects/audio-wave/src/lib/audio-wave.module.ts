import {NgModule} from '@angular/core';
import {AudioWaveComponent} from './component/audio-wave.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AudioWaveComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    AudioWaveComponent
  ]
})
export class AudioWaveModule {
}

import {NgModule} from '@angular/core';
import {AudioWaveComponent} from './component/audio-wave.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {AudioWaveService} from "./audio-wave.service";

@NgModule({
  declarations: [
    AudioWaveComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    AudioWaveService
  ],
  exports: [
    AudioWaveComponent
  ]
})
export class AudioWaveModule {
}

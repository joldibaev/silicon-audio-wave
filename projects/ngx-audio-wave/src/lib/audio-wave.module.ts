import {NgModule} from '@angular/core';
import {AudioWaveComponent} from './component/audio-wave.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {AudioWaveService} from "./service/audio-wave.service";

const components = [
  AudioWaveComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [AudioWaveService],
  exports: [...components]
})
export class AudioWaveModule {
}

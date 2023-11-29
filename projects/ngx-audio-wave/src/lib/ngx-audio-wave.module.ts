import {NgModule} from '@angular/core';
import {NgxAudioWaveComponent} from './component/ngx-audio-wave.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NgxAudioWaveService} from "./service/ngx-audio-wave.service";

const components = [
  NgxAudioWaveComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [NgxAudioWaveService],
  exports: [...components]
})
export class NgxAudioWaveModule {
}

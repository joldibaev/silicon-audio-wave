import {NgModule} from '@angular/core';
import {NgxAudioWaveComponent} from './component/ngx-audio-wave.component';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NgxAudioWaveService} from "./service/ngx-audio-wave.service";

const components = [
  NgxAudioWaveComponent
]

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [CommonModule],
  providers: [NgxAudioWaveService, provideHttpClient(withInterceptorsFromDi())]
})
export class NgxAudioWaveModule {
}

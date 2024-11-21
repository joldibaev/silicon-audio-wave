import {NgModule} from '@angular/core';
import {NgxAudioWaveComponent} from './component/ngx-audio-wave.component';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NgxAudioWaveService} from "./service/ngx-audio-wave.service";


@NgModule({
  declarations: [NgxAudioWaveComponent],
  exports: [NgxAudioWaveComponent],
  imports: [CommonModule],
  providers: [NgxAudioWaveService, provideHttpClient(withFetch())]
})
export class NgxAudioWaveModule {
}

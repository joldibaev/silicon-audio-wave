import {Component} from '@angular/core';
import {ToTimerPipe} from './pipes/to-timer.pipe';
import {NgxAudioWaveModule} from '../../projects/ngx-audio-wave/src/lib/ngx-audio-wave.module';

@Component({
  selector: 'app-root',
  imports: [NgxAudioWaveModule, ToTimerPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  audioText = '<audio>';
}

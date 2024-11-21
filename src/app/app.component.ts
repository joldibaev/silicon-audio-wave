import {Component} from '@angular/core';
import {ToTimerPipe} from './pipes/to-timer.pipe';
import {NgxAudioWaveModule} from 'ngx-audio-wave';

@Component({
  selector: 'app-root',
  imports: [NgxAudioWaveModule, ToTimerPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  audioText = '<audio>';
}

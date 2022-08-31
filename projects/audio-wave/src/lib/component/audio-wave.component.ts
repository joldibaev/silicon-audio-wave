import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'silicon-audio-wave',
  templateUrl: './audio-wave.component.html',
  styleUrls: ['./audio-wave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioWaveComponent implements OnInit, OnDestroy {
  private subGetAudio?: Subscription;
  private interval?: ReturnType<typeof setInterval>;
  private _normalizedData: number[] = [];

  @ViewChild('audioRef') audio?: ElementRef<HTMLAudioElement>;

  @Input() color = '#1e90ff';
  @Input() audioSrc?: string;
  @Input() samples = 50;
  @Input() height = 25;
  @Input() gap = 5;

  error = false;

  loading = false;
  playedPercent = 0;
  duration = 0;

  constructor(private httpClient: HttpClient,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.audioSrc) {
      this.fetchAudio(this.audioSrc);

      this.startInterval();
    }
  }

  ngOnDestroy() {
    this.stopInterval();

    this.subGetAudio?.unsubscribe();
  }

  play(time: number = 0) {
    const audio = this.audio?.nativeElement;
    if (audio) {
      void audio.play();

      if (time) {
        audio.currentTime = time;
      }
    }
  }

  pause() {
    const audio = this.audio?.nativeElement;
    if (audio) {
      audio.pause();
    }
  }

  stop() {
    const audio = this.audio?.nativeElement;
    if (audio) {
      audio.currentTime = 0;
      this.pause();
    }
  }

  setTime(mouseEvent: MouseEvent) {
    const offsetX = mouseEvent.offsetX;
    const width = this.width;

    const clickPercent = this.calculatePercent(width, offsetX);

    const time = (clickPercent * this.duration) / 100;

    void this.play(time);
  }

  get width() {
    return this.samples * this.gap;
  }

  get normalizedData() {
    return this._normalizedData;
  }

  private calculatePercent(total: number, value: number) {
    return (value / total) * 100 || 0;
  }

  private startInterval() {
    this.interval = setInterval(() => {
      const audio = this.audio?.nativeElement;
      if (audio) {
        if (!audio.paused) {
          this.playedPercent = this.calculatePercent(this.duration, audio.currentTime);
          this.changeDetectorRef.markForCheck();
        }
      }
    }, 100);
  }

  private stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private fetchAudio(audioSrc: string) {
    this.loading = true;
    this.changeDetectorRef.markForCheck();

    this.subGetAudio = this.httpClient
      .get(audioSrc, {responseType: 'arraybuffer'})
      .subscribe({
        next: async (next) => {
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(next);

          this.duration = Math.round(audioBuffer.duration);

          const filteredData = this.filterData(audioBuffer);
          this._normalizedData = this.normalizeData(filteredData);

          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error(error);

          this.error = true;

          this.loading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  /**
   * Filters the AudioBuffer retrieved from an external source
   * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
   * @returns {Array} an array of floating point numbers
   */
  private filterData(audioBuffer: AudioBuffer): number[] {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const blockSize = Math.floor(rawData.length / this.samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < this.samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }

  /**
   * Normalizes the audio data to make a cleaner illustration
   * @param {Array} filteredData the data from filterData()
   * @returns {Array} an normalized array of floating point numbers
   */
  private normalizeData(filteredData: number[]): number[] {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }
}

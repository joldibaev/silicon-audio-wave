import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {interval, Subscription} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'silicon-audio-wave',
  templateUrl: './audio-wave.component.html',
  styleUrls: ['./audio-wave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioWaveComponent implements OnInit, OnDestroy {
  private subTimer?: Subscription;
  private subGetAudio?: Subscription;
  private samples = 50;

  @ViewChild('audioRef') audio?: ElementRef<HTMLAudioElement>;

  @Input() color = '#1e90ff';
  @Input({required: true}) audioSrc?: string;
  @Input() height = 25;
  @Input() gap = 5;
  @Input() rounded = true;
  @Input() hideBtn = false;

  error = false;
  normalizedData: number[] = [];


  exactPlayedPercent = 0;

  get playedPercent() {
    return Math.round(this.exactPlayedPercent);
  }

  exactCurrentTime = 0;

  get currentTime() {
    return Math.round(this.exactCurrentTime);
  }

  isPause = true;

  loading = true;

  get isLoading() {
    return this.loading;
  }

  // duration
  exactDuration = 0;

  get duration() {
    return Math.round(this.exactDuration);
  }

  readonly isPlatformBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object,
              private httpClient: HttpClient,
              private changeDetectorRef: ChangeDetectorRef) {
    this.isPlatformBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.audioSrc && this.isPlatformBrowser) {
      this.fetchAudio(this.audioSrc);

      this.startInterval();
    }
  }

  ngOnDestroy() {
    this.stop();

    this.subGetAudio?.unsubscribe();
    this.subTimer?.unsubscribe();
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

    const time = (clickPercent * this.exactDuration) / 100;

    void this.play(time);
  }

  get width() {
    return this.samples * this.gap;
  }

  private calculatePercent(total: number, value: number) {
    return (value / total) * 100 || 0;
  }

  private startInterval() {
    this.subTimer?.unsubscribe();

    this.subTimer = interval(100).subscribe(() => {
      const audio = this.audio?.nativeElement;
      if (audio) {
        const percent = this.calculatePercent(this.exactDuration, audio.currentTime);
        this.exactPlayedPercent = percent < 100 ? percent : 100;
        this.exactCurrentTime = audio.currentTime;

        this.isPause = audio.paused;

        this.changeDetectorRef.markForCheck();
      }
    })
  }

  private fetchAudio(audioSrc: string) {
    this.loading = true;
    this.changeDetectorRef.markForCheck();

    this.subGetAudio = this.httpClient
      .get(audioSrc, {responseType: 'arraybuffer'})
      .subscribe({
        next: async (next) => {
          try {
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(next);

            this.exactDuration = audioBuffer.duration;

            const filteredData = this.filterData(audioBuffer);
            this.normalizedData = this.normalizeData(filteredData);
          } catch (e) {
            this.error = true;
          } finally {
            this.loading = false;
            this.changeDetectorRef.markForCheck();
          }
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

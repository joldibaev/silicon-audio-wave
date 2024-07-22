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
import { HttpClient } from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";
import {finalize, interval, Subscription} from "rxjs";
import {NgxAudioWaveService} from "../service/ngx-audio-wave.service";

@Component({
  selector: 'ngx-audio-wave',
  templateUrl: './ngx-audio-wave.component.html',
  styleUrls: ['./ngx-audio-wave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxAudioWaveComponent implements OnInit, OnDestroy {
  private subTimer?: Subscription;
  private subGetAudio?: Subscription;

  @ViewChild('audioRef') private audio?: ElementRef<HTMLAudioElement>;

  @Input() color: string = '#1e90ff';
  @Input({required: true}) audioSrc?: string;
  @Input() height: number = 25;
  @Input() gap: number = 5;
  @Input() rounded: boolean = true;
  @Input() hideBtn: boolean = false;

  error = false;
  protected normalizedData: number[] = [];

  exactPlayedPercent = 0;

  get playedPercent() {
    return Math.round(this.exactPlayedPercent);
  }

  exactCurrentTime = 0;
  get currentTime() {
    return Math.round(this.exactCurrentTime);
  }

  isPause = true;

  isLoading = true;

  // duration
  exactDuration = 0;
  get duration() {
    return Math.round(this.exactDuration);
  }

  protected readonly isPlatformBrowser = isPlatformBrowser(this.platformId);

  constructor(@Inject(PLATFORM_ID) private platformId: object,
              private httpClient: HttpClient,
              private audioWaveService: NgxAudioWaveService,
              private changeDetectorRef: ChangeDetectorRef) {
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
    return this.audioWaveService.samples * this.gap;
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
    this.isLoading = true;
    this.changeDetectorRef.markForCheck();

    this.subGetAudio?.unsubscribe();
    this.subGetAudio = this.httpClient
      .get(audioSrc, {responseType: 'arraybuffer'})
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }))
      .subscribe({
        next: async (next) => {
          try {
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(next);

            this.exactDuration = audioBuffer.duration;

            const filteredData = this.audioWaveService.filterData(audioBuffer);
            this.normalizedData = this.audioWaveService.normalizeData(filteredData);
          } catch (e) {
            this.error = true;
          }
        },
        error: (error) => {
          console.error(error);

          this.error = true;
        }
      });
  }
}

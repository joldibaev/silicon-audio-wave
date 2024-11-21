import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";
import {finalize, interval} from "rxjs";
import {NgxAudioWaveService} from "../service/ngx-audio-wave.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'ngx-audio-wave',
  templateUrl: './ngx-audio-wave.component.html',
  styleUrls: ['./ngx-audio-wave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxAudioWaveComponent implements OnInit, OnDestroy {
  @Input() color: string = '#1e90ff';
  @Input({required: true}) audioSrc?: string;
  @Input() height: number = 25;
  @Input() gap: number = 5;
  @Input() rounded: boolean = true;
  @Input() hideBtn: boolean = false;

  error = false;
  exactPlayedPercent = 0;
  exactCurrentTime = 0;
  isPause = true;
  isLoading = true;
  // duration
  exactDuration = 0;
  protected normalizedData: number[] = [];
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isPlatformBrowser = isPlatformBrowser(this.platformId);
  private readonly httpClient = inject(HttpClient);
  private readonly audioWaveService = inject(NgxAudioWaveService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('audioRef') private audio?: ElementRef<HTMLAudioElement>;

  constructor() {
  }

  get playedPercent() {
    return Math.round(this.exactPlayedPercent);
  }

  get currentTime() {
    return Math.round(this.exactCurrentTime);
  }

  get duration() {
    return Math.round(this.exactDuration);
  }

  get width() {
    return this.audioWaveService.samples * this.gap;
  }

  ngOnInit() {
    if (this.audioSrc && this.isPlatformBrowser) {
      this.fetchAudio(this.audioSrc);

      this.startInterval();
    }
  }

  ngOnDestroy() {
    this.stop();
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

  private calculatePercent(total: number, value: number) {
    return (value / total) * 100 || 0;
  }

  private startInterval() {
    interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
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

    this.httpClient
      .get(audioSrc, {responseType: 'arraybuffer'})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild
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
export class NgxAudioWaveComponent implements AfterViewInit, OnDestroy {
  color = input('#1e90ff');
  audioSrc = input.required<string>();
  height = input(25);
  gap = input(5)
  rounded = input(true);
  hideBtn = input(false);

  protected _error = signal(false);
  protected _exactPlayedPercent = signal(0);
  protected _exactCurrentTime = signal(0);
  protected _isPause = signal(true);
  protected _isLoading = signal(true);

  protected _exactDuration = signal(0);
  protected _normalizedData = signal<number[]>([]);

  // injecting
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isPlatformBrowser = isPlatformBrowser(this.platformId);
  private readonly httpClient = inject(HttpClient);
  private readonly audioWaveService = inject(NgxAudioWaveService);
  private readonly destroyRef = inject(DestroyRef);

  private audioRef = viewChild.required<ElementRef<HTMLAudioElement>>('audioRef');

  get exactPlayedPercent() {
    return this._exactPlayedPercent();
  }

  get exactDuration() {
    return this._exactDuration();
  }

  get exactCurrentTime() {
    return this._exactCurrentTime();
  }

  get isPause() {
    return this._isPause();
  }

  get isLoading() {
    return this._isLoading();
  }

  get playedPercent() {
    return Math.round(this._exactPlayedPercent());
  }

  get currentTime() {
    return Math.round(this._exactCurrentTime());
  }

  get duration() {
    return Math.round(this._exactDuration());
  }

  get width() {
    return this.audioWaveService.samples * this.gap();
  }

  ngAfterViewInit() {
    if (this.isPlatformBrowser) {
      this.fetchAudio(this.audioSrc());

      this.startInterval();
    }
  }

  ngOnDestroy() {
    this.stop();
  }

  play(time: number = 0) {
    if (!this.isPlatformBrowser) return;

    const audio = this.audioRef().nativeElement;
    void audio.play();

    if (time) {
      audio.currentTime = time;
    }
  }

  pause() {
    if (!this.isPlatformBrowser) return;

    const audio = this.audioRef().nativeElement;
    audio.pause();
  }

  stop() {
    if (!this.isPlatformBrowser) return;

    const audio = this.audioRef().nativeElement;
    audio.currentTime = 0;
    this.pause();
  }

  private calculatePercent(total: number, value: number) {
    return (value / total) * 100 || 0;
  }

  setTime(mouseEvent: MouseEvent) {
    const offsetX = mouseEvent.offsetX;
    const width = this.width;

    const clickPercent = this.calculatePercent(width, offsetX);

    const time = (clickPercent * this._exactDuration()) / 100;

    void this.play(time);
  }

  private startInterval() {
    interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const audio = this.audioRef().nativeElement;
        if (audio) {
          const percent = this.calculatePercent(this._exactDuration(), audio.currentTime);
          this._exactPlayedPercent.set(percent < 100 ? percent : 100);
          this._exactCurrentTime.set(audio.currentTime);

          this._isPause.set(audio.paused);
        }
      })
  }

  private fetchAudio(audioSrc: string) {
    this._isLoading.set(true);

    this.httpClient
      .get(audioSrc, {responseType: 'arraybuffer'})
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: async (arrayBuffer) => {
          try {
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            this._exactDuration.set(audioBuffer.duration);

            const filteredData = this.audioWaveService.filterData(audioBuffer);
            this._normalizedData.set(this.audioWaveService.normalizeData(filteredData));
          } catch (e) {
            this._error.set(true)
          }
        },
        error: (error) => {
          console.error(error);

          this._error.set(true)
        }
      });
  }
}

# Audio Wave for Angular 13+

Very simple audio wave system

## Screen
![alt text](https://github.com/joldibaev/silicon-audio-wave/raw/master/src/assets/demo2.png)

## Installation

Install the npm package.

	npm i ngx-audio-wave --save

Import module:

```ts
import {NgxAudioWaveModule} from "ngx-audio-wave";

@NgModule({
  imports: [NgxAudioWaveModule]
})
```

## Usage

```ts
audioSrc = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3';
```

```html
<section>
  <div>played percent: {{ngxAudioWave.playedPercent}} ({{ngxAudioWave.exactPlayedPercent}})</div>
  <div>current time: {{ngxAudioWave.currentTime}} ({{ngxAudioWave.exactCurrentTime}})</div>

  <ngx-audio-wave
    #ngxAudioWave
    audioSrc="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3"
  ></ngx-audio-wave>

  <div>duration: {{ngxAudioWave.duration}} ({{ngxAudioWave.exactDuration}})</div>
</section>
```

## Properties

```html
<!-- rounded -->
<ngx-audio-wave [rounded]="false" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>

<!-- color -->
<ngx-audio-wave color="#ee2133" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>

<!-- isLoading -->
<section>
  <ngx-audio-wave #audioRef color="#ee2133" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
  <div *ngIf="!audioRef.isLoading">duration: {{ngxAudioWave.duration|toTimer}} (no duration while loading)</div>
  <div>duration: {{ngxAudioWave.duration|toTimer}} (zero will be display while loading)</div>
</section>

<!-- height -->
<ngx-audio-wave [height]="50" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<ngx-audio-wave [height]="100" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<ngx-audio-wave [height]="10" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>

<!-- gap -->
<ngx-audio-wave [gap]="1" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<ngx-audio-wave [gap]="2" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<ngx-audio-wave [gap]="9" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>

<!-- error will be displayed, cause 404 -->
<ngx-audio-wave audioSrc="assets/no_file.mp3"></ngx-audio-wave>
```

## Custom btn

### One action btn

```html
<ngx-audio-wave #audioRef1 [hideBtn]="true" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<button (click)="audioRef1.play()">Play</button>
<button (click)="audioRef1.pause()">Pause</button>
```

### Toggle btn
```html
<b>Toggle btn (is pause: {{audioRef2.isPause}})</b>
<ngx-audio-wave #audioRef2 [hideBtn]="true" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></ngx-audio-wave>
<button *ngIf="audioRef2.isPause" (click)="audioRef2.play()">Play</button>
<button *ngIf="!audioRef2.isPause" (click)="audioRef2.pause()">Pause</button>
<button (click)="audioRef2.stop()">Stop</button>
```

or you can get access to The HTML ```<audio>``` element inside component
```audioRef2.audio?.nativeElement```

Example:
```html
<button *ngIf="audioRef2.audio?.nativeElement?.paused" (click)="audioRef2.play()">Play</button>
<button *ngIf="!audioRef2.audio?.nativeElement?.paused" (click)="audioRef2.pause()">Pause</button>
```
#### WARNING: using this code will lead to [NG0100: ExpressionChangedAfterItHasBeenCheckedError]


## Source

https://github.com/joldibaev/ngx-audio-wave/tree/master/projects/audio-wave

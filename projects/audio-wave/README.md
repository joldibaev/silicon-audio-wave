# Audio Wave for Angular 13+

Very simple audio wave system from Silicon

## Screen
![alt text](https://github.com/joldibaev/silicon-audio-wave/raw/master/src/assets/demo.png)

## Installation

Install the npm package.

	npm i audio-wave --save

Import module:

```ts
import {AudioWaveModule} from "audio-wave";

@NgModule({
  imports: [AudioWaveModule]
})
```

## Usage

```ts
audioSrc = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3';
```

```html
<silicon-audio-wave [audioSrc]="audioSrc"></silicon-audio-wave>
```

## Properties

```html
<!-- rounded -->
<silicon-audio-wave [rounded]="false" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>

<!-- color -->
<silicon-audio-wave color="#ee2133" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>

<!-- height -->
<silicon-audio-wave [height]="50" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
<silicon-audio-wave [height]="100" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
<silicon-audio-wave [height]="10" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>

<!-- gap -->
<silicon-audio-wave [gap]="1" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
<silicon-audio-wave [gap]="2" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
<silicon-audio-wave [gap]="9" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>

<!-- error will be displayed, cause 404 -->
<silicon-audio-wave audioSrc="assets/no_file.mp3"></silicon-audio-wave>
```

## Custom btn

### One action btn

```html
<silicon-audio-wave #audioRef1 [hideBtn]="true" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
<button (click)="audioRef1.play()">Play</button>
<button (click)="audioRef1.pause()">Pause</button>
```

### Toggle btn
```html
<b>Toggle btn (is pause: {{audioRef2.isPause}})</b>
<silicon-audio-wave #audioRef2 [hideBtn]="true" audioSrc="assets/voice_29-06-2022_23-30-15.ogg"></silicon-audio-wave>
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

https://github.com/joldibaev/silicon-audio-wave/tree/master/projects/audio-wave

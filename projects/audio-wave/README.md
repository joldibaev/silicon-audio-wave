# Audio Wave for Angular 13+

Very simple audio wave system from Silicon

## Installation

Install the npm package.

	npm i silicon-audio-wave --save

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
<silicon-audio-wave [rounded]="false" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>

<!-- color -->
<silicon-audio-wave color="#ee2133" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>

<!-- height -->
<silicon-audio-wave [height]="50" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>
<silicon-audio-wave [height]="100" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>
<silicon-audio-wave [height]="10" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>

<!-- gap -->
<silicon-audio-wave [gap]="1" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>
<silicon-audio-wave [gap]="2" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>
<silicon-audio-wave [gap]="9" audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>

<!-- error will be displayed, cause 404 -->
<silicon-audio-wave audioSrc="assets/no_file.mp3"></silicon-audio-wave>
```

## Source

https://github.com/joldibaev/silicon-audio-wave/tree/master/projects/audio-wave

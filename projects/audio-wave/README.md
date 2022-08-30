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
or

```html
<silicon-audio-wave audioSrc="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3"></silicon-audio-wave>

<silicon-audio-wave audioSrc="assets/voice_29-06-2022_23-30-15"></silicon-audio-wave>

<!-- error will be displayed, cause 404 -->
<silicon-audio-wave audioSrc="assets/no_file.mp3"></silicon-audio-wave>
```

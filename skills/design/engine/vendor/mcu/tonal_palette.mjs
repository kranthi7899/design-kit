/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified by design-harness 2026-10: ported to ESM JavaScript (types and comments
 * removed, import paths flattened to ./name.mjs). Upstream: material-color-utilities
 * typescript/palettes/tonal_palette.ts @ bd811e4.
 */
import { Hct } from './hct.mjs';
export class TonalPalette {
    hue;
    chroma;
    keyColor;
    cache = new Map();
    static fromInt(argb) {
        const hct = Hct.fromInt(argb);
        return TonalPalette.fromHct(hct);
    }
    static fromHct(hct) {
        return new TonalPalette(hct.hue, hct.chroma, hct);
    }
    static fromHueAndChroma(hue, chroma) {
        const keyColor = new KeyColor(hue, chroma).create();
        return new TonalPalette(hue, chroma, keyColor);
    }
    constructor(hue, chroma, keyColor){
        this.hue = hue;
        this.chroma = chroma;
        this.keyColor = keyColor;
    }
    tone(tone) {
        let argb = this.cache.get(tone);
        if (argb === undefined) {
            if (tone == 99 && Hct.isYellow(this.hue)) {
                argb = this.averageArgb(this.tone(98), this.tone(100));
            } else {
                argb = Hct.from(this.hue, this.chroma, tone).toInt();
            }
            this.cache.set(tone, argb);
        }
        return argb;
    }
    getHct(tone) {
        return Hct.fromInt(this.tone(tone));
    }
    averageArgb(argb1, argb2) {
        const red1 = argb1 >>> 16 & 0xff;
        const green1 = argb1 >>> 8 & 0xff;
        const blue1 = argb1 & 0xff;
        const red2 = argb2 >>> 16 & 0xff;
        const green2 = argb2 >>> 8 & 0xff;
        const blue2 = argb2 & 0xff;
        const red = Math.round((red1 + red2) / 2);
        const green = Math.round((green1 + green2) / 2);
        const blue = Math.round((blue1 + blue2) / 2);
        return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
    }
}
class KeyColor {
    hue;
    requestedChroma;
    chromaCache = new Map();
    maxChromaValue = 200.0;
    constructor(hue, requestedChroma){
        this.hue = hue;
        this.requestedChroma = requestedChroma;
    }
    create() {
        const pivotTone = 50;
        const toneStepSize = 1;
        const epsilon = 0.01;
        let lowerTone = 0;
        let upperTone = 100;
        while(lowerTone < upperTone){
            const midTone = Math.floor((lowerTone + upperTone) / 2);
            const isAscending = this.maxChroma(midTone) < this.maxChroma(midTone + toneStepSize);
            const sufficientChroma = this.maxChroma(midTone) >= this.requestedChroma - epsilon;
            if (sufficientChroma) {
                if (Math.abs(lowerTone - pivotTone) < Math.abs(upperTone - pivotTone)) {
                    upperTone = midTone;
                } else {
                    if (lowerTone === midTone) {
                        return Hct.from(this.hue, this.requestedChroma, lowerTone);
                    }
                    lowerTone = midTone;
                }
            } else {
                if (isAscending) {
                    lowerTone = midTone + toneStepSize;
                } else {
                    upperTone = midTone;
                }
            }
        }
        return Hct.from(this.hue, this.requestedChroma, lowerTone);
    }
    maxChroma(tone) {
        if (this.chromaCache.has(tone)) {
            return this.chromaCache.get(tone);
        }
        const chroma = Hct.from(this.hue, this.maxChromaValue, tone).chroma;
        this.chromaCache.set(tone, chroma);
        return chroma;
    }
}

/*!
 * TimeLink TL3 Audio Engine Next
 * Experimental MSE append pipeline. Keeps MP3 frame parsing and decoding inside
 * the browser's native MediaSource implementation; never decodes arbitrary
 * encrypted segment fragments independently with decodeAudioData().
 */
(function (global) {
  'use strict';

  function rangesOf(buffered) {
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push([Number(buffered.start(i).toFixed(3)), Number(buffered.end(i).toFixed(3))]);
    }
    return ranges;
  }

  class TL3AudioEngineNext {
    constructor(audio) {
      this.audio = audio;
      this.queue = Promise.resolve();
      this.appendCount = 0;
      this.appendFailures = 0;
      this.lastAppendAt = 0;
      this.lastRanges = [];
      this.maxGapSeconds = 0;
      this.stopped = false;
    }

    append(sourceBuffer, bytes, segmentNo) {
      const execute = async () => {
        if (this.stopped) throw new Error('TL3 Audio Engine Next stopped');
        if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0) {
          throw new Error('TL3 Audio Engine Next received an empty segment');
        }

        if (sourceBuffer.updating) {
          await new Promise((resolve, reject) => {
            const onEnd = () => { cleanup(); resolve(); };
            const onError = () => { cleanup(); reject(new Error('SourceBuffer update failed before segment ' + segmentNo)); };
            const cleanup = () => {
              sourceBuffer.removeEventListener('updateend', onEnd);
              sourceBuffer.removeEventListener('error', onError);
            };
            sourceBuffer.addEventListener('updateend', onEnd, { once: true });
            sourceBuffer.addEventListener('error', onError, { once: true });
          });
        }

        await new Promise((resolve, reject) => {
          const cleanup = () => {
            sourceBuffer.removeEventListener('updateend', onEnd);
            sourceBuffer.removeEventListener('error', onError);
            sourceBuffer.removeEventListener('abort', onAbort);
          };
          const onEnd = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error('MSE append error at segment ' + segmentNo)); };
          const onAbort = () => { cleanup(); reject(new Error('MSE append aborted at segment ' + segmentNo)); };
          sourceBuffer.addEventListener('updateend', onEnd, { once: true });
          sourceBuffer.addEventListener('error', onError, { once: true });
          sourceBuffer.addEventListener('abort', onAbort, { once: true });
          try { sourceBuffer.appendBuffer(bytes); }
          catch (error) { cleanup(); reject(error); }
        });

        this.appendCount++;
        this.lastAppendAt = performance.now();
        const ranges = rangesOf(sourceBuffer.buffered);
        for (let i = 1; i < ranges.length; i++) {
          const gap = Math.max(0, ranges[i][0] - ranges[i - 1][1]);
          this.maxGapSeconds = Math.max(this.maxGapSeconds, gap);
        }
        this.lastRanges = ranges;
        const current = Number(this.audio.currentTime || 0);
        let ahead = 0;
        for (const range of ranges) {
          if (current >= range[0] - 0.05 && current <= range[1] + 0.05) {
            ahead = Math.max(0, range[1] - current);
            break;
          }
        }
        console.debug('[TL3-ENGINE-NEXT] append', {
          segment: segmentNo,
          bytes: bytes.byteLength,
          currentTime: Number(current.toFixed(3)),
          bufferedAhead: Number(ahead.toFixed(3)),
          ranges,
          appendCount: this.appendCount
        });
        return { ranges, bufferedAhead: ahead };
      };

      const task = this.queue.then(execute, execute);
      this.queue = task.catch((error) => {
        this.appendFailures++;
        console.error('[TL3-ENGINE-NEXT] append failed', error);
      });
      return task;
    }

    snapshot(sourceBuffer) {
      const ranges = sourceBuffer ? rangesOf(sourceBuffer.buffered) : this.lastRanges;
      const current = Number(this.audio.currentTime || 0);
      let ahead = 0;
      for (const range of ranges) {
        if (current >= range[0] - 0.05 && current <= range[1] + 0.05) {
          ahead = Math.max(0, range[1] - current);
          break;
        }
      }
      return {
        appendCount: this.appendCount,
        appendFailures: this.appendFailures,
        bufferedAhead: Number(ahead.toFixed(3)),
        maxGapSeconds: Number(this.maxGapSeconds.toFixed(3)),
        ranges
      };
    }

    stop() {
      this.stopped = true;
    }
  }

  global.TL3AudioEngineNext = TL3AudioEngineNext;
})(window);

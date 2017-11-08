const MAX_AMP = 255;

export default class AudioHelper {
  constructor(src, options={}) {
    this.smoothing = options.smoothing || 0.99;
    this.decay = options.decay || 0.0001;
    this.threshold = options.threshold || 0.2;
    this.timeMin = options.timeMin || 300;

    this._lastBeat = -Infinity;
    this._previousFrequency = {};
    this._currentThreshold = -Infinity;

    this.el = document.createElement('audio');
    this.el.loop = true;
    this.el.src = src;
    document.body.appendChild(this.el);

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.node = this.context.createMediaElementSource(this.el);
    this.analyser = this.context.createAnalyser();
    this.dest = this.context.destination;

    this.node.connect(this.dest);
    this.node.connect(this.analyser);
    this.analyser.connect(this.dest);
    this.freq = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getFrequency(n) {
    // http://chimera.labs.oreilly.com/books/1234000001552/ch05.html#s05_1
    const nyquist = this.context.sampleRate / 2;
    const index = Math.round(n/nyquist * this.freq.length);
    const previous = this._previousFrequency[index];
    let value = this.freq[index] / MAX_AMP;

    if (previous === void 0) {
      return this._previousFrequency[index] = value;
    }

    return this._previousFrequency[index] = Math.max(value, previous * this.smoothing);
  }

  isBeat() {
    if (this.rms > this.threshold &&
        this.rms > this._currentThreshold &&
        this._lastBeat + this.timeMin < this.time) {
      this._lastBeat = this.time;
      this._currentThreshold = this.rms;
      return true;
    }
    this._currentThreshold -= this.decay * this.delta;
    return false;
  }

  getRMS() {
    let sum = 0;
    for (let i = 0; i < this.freq.length; i++) {
      sum += this.freq[i] * this.freq[i];
    }
    let rms = Math.sqrt(sum / this.freq.length) / MAX_AMP;

    this.rms = this.rms ? Math.max(rms, this.rms * this.smoothing) : rms;
    return this.rms;
  }

  update(time, delta) {
    this.time = time;
    this.delta = delta;
    this.analyser.getByteFrequencyData(this.freq);
  }
}

'use babel';

import random from './random';
import extend from 'extend';
import spline from './spline';
import shortest from './shortest';
import Point from './point';

class NoiseLineChild {
  constructor(parent, noiseOptions, lightningLine) {
    this.parent = parent;
    this._lastChangeTime = 0;
    this.noiseOptions = noiseOptions;
    this.noiseOptions = extend({
        base: 30,
        amplitude: 0.5,
        speed: 0.002,
        offset: 0
    }, this.noiseOptions);
    this.perlinNoise = lightningLine.perlinNoise;
    this.points = [];
    this.lineLength = 0;
    this.startStep = 0;
    this.endStep = 0;
  }

  update() {
      var parent = this.parent;
      var plen = parent.points.length;

      var currentTime = new Date().getTime();
      if (
          currentTime - this._lastChangeTime > 10000 * random()
          || plen < this.endStep
      ) {
          var stepMin = Math.floor(plen / 10);
          var startStep = this.startStep = Math.floor(random() * Math.floor(plen / 3 * 2));
          this.endStep = startStep + stepMin + Math.floor(random() * (plen - startStep - stepMin) + 1);
          this._lastChangeTime = currentTime;
      }

      var range = this.parent.points.slice(this.startStep, this.endStep);
      var rangeLen = range.length;

      var sep = 2;
      var seg = (rangeLen - 1) / sep;
      var controls = [];
      var i, j;
      for (i = 0; i <= sep; i++) {
          j = Math.floor(seg * i);
          controls.push(range[j]);
      }

      var base = spline(controls, Math.floor(rangeLen / 3));

      this.noise(base, controls[0].distance(controls[2]));

      this.points = shortest(this.points);
  }

  noise(bases, range) {
      var pointsOld = this.points;
      var points = this.points = [];

      var opts = this.noiseOptions;
      var base = opts.base;
      var amp = opts.amplitude;
      var speed = opts.speed;
      var offset = opts.offset += random() * speed;

      var p, next, angle, sin, cos, av, ax, ay, bv, bx, by, m, px, py;

      for (var i = 0, len = bases.length; i < len; i++) {
          p = bases[i];
          next = i === len - 1 ? p : bases[i + 1];

          angle = next.subtract(p).angle();
          sin = Math.sin(angle);
          cos = Math.cos(angle);

          av = range * this.perlinNoise.noise(i / base - offset, offset) * 0.5 * amp;
          ax = av * sin;
          ay = av * cos;

          bv = range * this.perlinNoise.noise(i / base + offset, offset) * 0.5 * amp;
          bx = bv * sin;
          by = bv * cos;

          m = Math.sin(Math.PI * (i / (len - 1)));

          px = p.x + (ax - bx) * m;
          py = p.y - (ay - by) * m;

          points.push(pointsOld.length ? pointsOld.shift().set(px, py) : new Point(px, py));
      }
  }
}

module.exports = NoiseLineChild;

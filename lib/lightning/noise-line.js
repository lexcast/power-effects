'use babel';

import random from './random';
import extend from 'extend';
import spline from './spline';
import shortest from './shortest';
import Point from './point';
import NoiseLineChild from './noise-line-child';

class NoiseLine {
  constructor(segmentsNum, noiseOptions, perlinNoise) {
    this.segmentsNum = segmentsNum;
    this.perlinNoise = perlinNoise;

    this.noiseOptions = extend({
        base: 30,
        amplitude: 0.5,
        speed: 0.002,
        offset: 0
    }, noiseOptions);

    this.points = [];
    this.lineLength = 0;
    this.children = [];
  }

  createChild(noiseOptions, lightningLine) {
      var child = new NoiseLineChild(this, noiseOptions || this.noiseOptions, lightningLine);
      this.children.push(child);
      return child;
  }

  eachChild(callback) {
      var children = this.children;
      for (var i = 0, len = children.length; i < len; i++) {
          callback.call(children, children[i], i, len);
      }
  }

  eachPoints(callback) {
      var points = this.points;
      for (var i = 0, len = points.length; i < len; i++) {
          callback.call(points, points[i], i, len);
      }
  }

  update(controls) {
      var i, len;

      var lineLength = 0;
      for (i = 0, len = controls.length; i < len; i++) {
          if (i === len - 1) break;
          lineLength += controls[i].distance(controls[i + 1]);
      }
      this.lineLength = lineLength;

      this.noise(spline(controls, this.segmentsNum), lineLength);

      this.points = shortest(this.points);

      var children = this.children;
      for (i = 0, len = children.length; i < len; i++) {
          children[i].update();
      }
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

module.exports = NoiseLine;

'use babel';

import random from './random';
import Point from './point';

class DragPoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.radius = 50;
    this.alpha = 0.2;
    this.dragging = false;
    this.dying = false;
    this.dead = false;

    this._v = new Point(this.randomRange(-3, 3), this.randomRange(-3, 3));

    this._mouse = null;
    this._latestMouse = new Point();
    this._mouseDist = null;

    this._currentAlpha = 0;
    this._currentRadius = 0;
  }

  hitTest(mouse) {
      return this.distance(mouse) < this.radius;
  }

  randomRange(min, max) {
    return random() * (max - min) + min;
  }

  dragStart(mouse) {
      if (this.hitTest(mouse)) {
          this._mouse = mouse;
          this._mouseDist = this.subtract(this._mouse);
          this.dragging = true;
      }
      return this.dragging;
  }

  dragEnd() {
      if (this.dragging && this._latestMouse) {
          this._v.set(this._mouse.subtract(this._latestMouse));
      }
      this.dragging = false;
      this._mouse = this._mouseDist = null;
  }

  kill() {
      this.dying = true;
      this.radius = 0;
  }

  update(context) {
      var v = this._v;

      if (this._mouse) {
          this.set(this._mouse.add(this._mouseDist));
          this._latestMouse.set(this._mouse);
      } else {
          this.offset(v);
          v.x *= 0.97;
          v.y *= 0.97;

          var vlen = v.length();
          if (vlen > 30) {
              v.normalize(30);
          } else if (vlen < 1) {
              v.normalize(1);
          }
      }

      var radius = this.radius;

      if (this.x < radius) {
          this.x = this.radius;
          if (v.x < 0) v.x *= -1;
      } else if (context && this.x > context.canvas.width - radius) {
          this.x = context.canvas.width - radius;
          if (v.x > 0) v.x *= -1;
      }

      if (this.y < radius) {
          this.y = radius;
          if (v.y < 0) v.y *= -1;
      } else if (context && this.y > context.canvas.height - radius) {
          this.y = context.canvas.height - radius;
          if (v.y > 0) v.y *= -1;
      }

      var d;
      // Alpha
      d = this.alpha - this._currentAlpha;
      if ((d < 0 ? -d : d) > 0.001) this._currentAlpha += d * 0.1;
      // Radius
      d = radius - this._currentRadius;
      if ((d < 0 ? -d : d) > 0.01) {
          this._currentRadius += d * 0.35;
      } else if (this.dying) {
          this.dead = true;
      }
      this._currentRadius *= this.randomRange(0.9, 1);
  }

  draw(ctx, Color) {
      var radius = this._currentRadius;
      var gradient = ctx.createRadialGradient(this.x, this.y, radius / 3, this.x, this.y, radius);
      gradient.addColorStop(0, Color.setAlphaToString(this._currentAlpha));
      gradient.addColorStop(1, Color.setAlphaToString(0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(this.x + radius, this.y);
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
      ctx.fill();
  }
}

module.exports = DragPoint;

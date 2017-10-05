'use babel';

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static create(o, y) {
      if (isArray(o)) return new Point(o[0], o[1]);
      if (isObject(o)) return new Point(o.x, o.y);
      return new Point(o, y);
  }

  static add(p1, p2) {
      return new Point(p1.x + p2.x, p1.y + p2.y);
  }

  static subtract(p1, p2) {
      return new Point(p1.x - p2.x, p1.y - p2.y);
  }

  static scale(p, scaleX, scaleY) {
      if (isObject(scaleX)) {
          scaleY = scaleX.y;
          scaleX = scaleX.x;
      } else if (!isNumber(scaleY)) {
          scaleY = scaleX;
      }
      return new Point(p.x * scaleX, p.y * scaleY);
  }

  static equals(p1, p2) {
      return p1.x == p2.x && p1.y == p2.y;
  }

  static angle(p) {
      return Math.atan2(p.y, p.x);
  }

  static distance(p1, p2) {
      var a = p1.x - p2.x;
      var b = p1.y - p2.y;
      return Math.sqrt(a * a + b * b);
  }

  static dot(p1, p2) {
      return p1.x * p2.x + p1.y * p2.y;
  }

  static cross(p1, p2) {
      return p1.x * p2.y - p1.y * p2.x;
  }

  static interpolate(p1, p2, f) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      return new Point(p1.x + dx * f, p1.y + dy * f);
  }

  static polar(length, radian) {
      return new Point(length * Math.sin(radian), length * Math.cos(radian));
  }

  add(p) {
      return Point.add(this, p);
  }

  subtract(p) {
      return Point.subtract(this, p);
  }

  scale(scaleX, scaleY) {
      return Point.scale(this, scaleX, scaleY);
  }

  equals(p) {
      return Point.equals(this, p);
  }

  angle() {
      return Point.angle(this);
  }

  distance(p) {
      return Point.distance(this, p);
  }

  length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set(x, y) {
      if (isObject(x)) {
          y = x.y;
          x = x.x;
      }

      this.x = x || 0;
      this.y = y || 0;

      return this;
  }

  offset(x, y) {
      if (isObject(x)) {
          y = x.y;
          x = x.x;
      }

      this.x += x || 0;
      this.y += y || 0;

      return this;
  }

  normalize(thickness) {
      if (isNull(thickness) || isUndefined(thickness)) {
          thickness = 1;
      }

      var length = this.length();

      if (length > 0) {
          this.x = this.x / length * thickness;
          this.y = this.y / length * thickness;
      }

      return this;
  }

  negate() {
      this.x *= -1;
      this.y *= -1;

      return this;
  }

  perp() {
      this.x = - y;
      this.y = x;

      return this;
  }

  clone() {
      return Point.create(this);
  }

  toArray() {
      return [this.x, this.y];
  }

  toString() {
      return '(x:' + this.x + ', y:' + this.y + ')';
  }
}

function isObject(value, ignoreArray) {
    return typeof value === 'object' && value !== null;
}

function isNumber(value) {
    return typeof value === 'number';
}

function isString(value) {
    return typeof value === 'string';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function isNull(value) {
    return value === null;
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

module.exports = Point;

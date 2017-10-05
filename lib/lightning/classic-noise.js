'use babel';

import dot from './dot';
import matrix from './matrix';
import Xorshift from './xorshift';

class ClassicNoise {
  constructor(seed) {
    this.seed(seed);
    this._octaves = 4;
    this._fallout = 0.5;
  }

  seed(seed) {
      var random = new Xorshift(seed || new Date().getTime()).random;

      var i;
      var p = [];
      for (i = 0; i < 256; i++) {
          p[i] = Math.floor(random() * 256);
      }

      var perm = [];
      for (i = 0; i < 512; i++) {
          perm[i] = p[i & 255];
      }

      this._perm = perm;
  }

  octaves(octaves) {
      if (!arguments.length) return this._octaves;
      return this._octaves = octaves;
  }

  fallout(fallout) {
      if (!arguments.length) return this._fallout;
      return this._fallout = fallout;
  }

  noise(x, y, z) {
      var result = 0;
      var noise;
      var f = 1;
      var oct = this._octaves;
      var amp = 0.5;
      var fallout = this._fallout;

      switch (arguments.length) {
          case 1  : noise = function() { return this.noise2d(x * f, 0); }; break;
          case 2  : noise = function() { return this.noise2d(x * f, y * f); }; break;
          case 3  : noise = function() { return this.noise3d(x * f, y * f, z * f); }; break;
          default : return result;
      }

      for (var i = 0; i < oct; ++i) {
          result += (1 + noise.call(this)) * amp * 0.5;
          amp *= fallout;
          f *= 2;
      }

      return result;
  }

  noise2d(x, y) {
      var X = Math.floor(x); var Y = Math.floor(y);
      x = x - X;             y = y - Y;
      X = X & 255;           Y = Y & 255;

      var perm = this._perm;

      var gi00 = perm[X + perm[Y]] % 12;
      var gi01 = perm[X + perm[Y + 1]] % 12;
      var gi10 = perm[X + 1 + perm[Y]] % 12;
      var gi11 = perm[X + 1 + perm[Y + 1]] % 12;

      var n00 = dot.dot2d(matrix.GRAD3[gi00], x, y);
      var n10 = dot.dot2d(matrix.GRAD3[gi10], x - 1, y);
      var n01 = dot.dot2d(matrix.GRAD3[gi01], x, y - 1);
      var n11 = dot.dot2d(matrix.GRAD3[gi11], x - 1, y - 1);

      var u = fade(x); var v = fade(y);

      var nx0 = mix(n00, n10, u); var nx1 = mix(n01, n11, u);

      var nxy = mix(nx0, nx1, v);

      return nxy;
  }

  noise3d(x, y, z) {
      var X = Math.floor(x); var Y = Math.floor(y); var Z = Math.floor(z);
      x = x - X;             y = y - Y;             z = z - Z;
      X = X & 255;           Y = Y & 255;           Z = Z & 255;

      var perm = this._perm;

      var gi000 = perm[X + perm[Y + perm[Z]]] % 12;
      var gi001 = perm[X + perm[Y + perm[Z + 1]]] % 12;
      var gi010 = perm[X + perm[Y + 1 + perm[Z]]] % 12;
      var gi011 = perm[X + perm[Y + 1 + perm[Z + 1]]] % 12;
      var gi100 = perm[X + 1 + perm[Y + perm[Z]]] % 12;
      var gi101 = perm[X + 1 + perm[Y + perm[Z + 1]]] % 12;
      var gi110 = perm[X + 1 + perm[Y + 1 + perm[Z]]] % 12;
      var gi111 = perm[X + 1 + perm[Y + 1 + perm[Z + 1]]] % 12;

      var n000 = dot.dot3d(matrix.GRAD3[gi000], x, y, z);
      var n100 = dot.dot3d(matrix.GRAD3[gi100], x - 1, y, z);
      var n010 = dot.dot3d(matrix.GRAD3[gi010], x, y - 1, z);
      var n110 = dot.dot3d(matrix.GRAD3[gi110], x - 1, y - 1, z);
      var n001 = dot.dot3d(matrix.GRAD3[gi001], x, y, z - 1);
      var n101 = dot.dot3d(matrix.GRAD3[gi101], x - 1, y, z - 1);
      var n011 = dot.dot3d(matrix.GRAD3[gi011], x, y - 1, z - 1);
      var n111 = dot.dot3d(matrix.GRAD3[gi111], x - 1, y - 1, z - 1);

      var u = fade(x); var v = fade(y); var w = fade(z);

      var nx00 = mix(n000, n100, u); var nx01 = mix(n001, n101, u);
      var nx10 = mix(n010, n110, u); var nx11 = mix(n011, n111, u);

      var nxy0 = mix(nx00, nx10, v); var nxy1 = mix(nx01, nx11, v);

      var nxyz = mix(nxy0, nxy1, w);

      return nxyz;
  }
}

function mix(a, b, t) {
    return (1 - t) * a + t * b;
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

module.exports = ClassicNoise;

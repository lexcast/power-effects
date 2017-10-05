'use babel';

import dot from './dot';
import matrix from './matrix';
import ClassicNoise from './classic-noise';

class SimplexNoise extends ClassicNoise {
  constructor(seed) {
    super(seed);
  }

  noise(x, y, z, w) {
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
          case 4  : noise = function() { return this.noise4d(x * f, y * f, z * f, w * f); }; break;
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
      var n0, n1, n2;

      var F2 = 0.5 * (Math.sqrt(3) - 1);
      var s = (x + y) * F2;
      var i = Math.floor(x + s); var j = Math.floor(y + s);

      var G2 = (3 - Math.sqrt(3)) / 6;
      var t = (i + j) * G2;
      var X0 = i - t;  var Y0 = j - t;
      var x0 = x - X0; var y0 = y - Y0;

      var i1, j1;
      if (x0 > y0) {
          i1 = 1; j1 = 0;
      } else {
          i1 = 0; j1 = 1;
      }

      var x1 = x0 - i1 + G2;    var y1 = y0 - j1 + G2;
      var x2 = x0 - 1 + 2 * G2; var y2 = y0 - 1 + 2 * G2;

      var perm = this._perm;

      var ii = i & 255; var jj = j & 255;
      var gi0 = perm[ii + perm[jj]] % 12;
      var gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
      var gi2 = perm[ii + 1 + perm[jj + 1]] % 12;

      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 < 0) {
          n0 = 0;
      } else {
          t0 *= t0;
          n0 = t0 * t0 * dot.dot2d(matrix.GRAD3[gi0], x0, y0);
      }

      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 < 0) {
          n1 = 0;
      } else {
          t1 *= t1;
          n1 = t1 * t1 * dot.dot2d(matrix.GRAD3[gi1], x1, y1);
      }

      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 < 0) {
          n2 = 0;
      } else {
          t2 *= t2;
          n2 = t2 * t2 * dot.dot2d(matrix.GRAD3[gi2], x2, y2);
      }

      return 70 * (n0 + n1 + n2);
  }

  noise3d(x, y, z) {
      var n0, n1, n2, n3;

      var F3 = 1 / 3;
      var s = (x + y + z) * F3;
      var i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);

      var G3 = 1 / 6;
      var t = (i + j + k) * G3;
      var X0 = i - t;  var Y0 = j - t;  var Z0 = k - t;
      var x0 = x - X0; var y0 = y - Y0; var z0 = z - Z0;

      var i1, j1, k1;
      var i2, j2, k2;
      if (x0 >= y0) {
          if (y0 >= z0) {
              i1 = 1; j1 = 0; k1 = 0;
              i2 = 1; j2 = 1; k2 = 0;
          } else if (x0 >= z0) {
              i1 = 1; j1 = 0; k1 = 0;
              i2 = 1; j2 = 0; k2 = 1;
          } else {
              i1 = 0; j1 = 0; k1 = 1;
              i2 = 1; j2 = 0; k2 = 1;
          }
      } else {
          if (y0 < z0) {
              i1 = 0; j1 = 0; k1 = 1;
              i2 = 0; j2 = 1; k2 = 1;
          } else if (x0 < z0) {
              i1 = 0; j1 = 1; k1 = 0;
              i2 = 0; j2 = 1; k2 = 1;
          } else {
              i1 = 0; j1 = 1; k1 = 0;
              i2 = 1; j2 = 1; k2 = 0;
          }
      }

      var x1 = x0 - i1 + G3;     var y1 = y0 - j1 + G3;     var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2 * G3; var y2 = y0 - j2 + 2 * G3; var z2 = z0 - k2 + 2 * G3;
      var x3 = x0 - 1 + 3 * G3;  var y3 = y0 - 1 + 3 * G3;  var z3 = z0 - 1 + 3 * G3;

      var perm = this._perm;

      var ii = i & 255; var jj = j & 255; var kk = k & 255;
      var gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
      var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
      var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
      var gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) {
          n0 = 0;
      } else {
          t0 *= t0;
          n0 = t0 * t0 * dot.dot3d(matrix.GRAD3[gi0], x0, y0, z0);
      }

      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) {
          n1 = 0;
      } else {
          t1 *= t1;
          n1 = t1 * t1 * dot.dot3d(matrix.GRAD3[gi1], x1, y1, z1);
      }

      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) {
          n2 = 0;
      } else {
          t2 *= t2;
          n2 = t2 * t2 * dot.dot3d(matrix.GRAD3[gi2], x2, y2, z2);
      }

      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) {
          n3 = 0;
      } else {
          t3 *= t3;
          n3 = t3 * t3 * dot.dot3d(matrix.GRAD3[gi3], x3, y3, z3);
      }

      return 32 * (n0 + n1 + n2 + n3);
  }

  noise4d(x, y, z, w) {
      var F4 = (Math.sqrt(5) - 1) / 4;
      var G4 = (5 - Math.sqrt(5)) / 20;
      var n0, n1, n2, n3, n4;

      var s = (x + y + z + w) * F4;
      var i = Math.floor(x + s); var j = Math.floor(y + s);
      var k = Math.floor(z + s); var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4;
      var X0 = i - t;  var Y0 = j - t;  var Z0 = k - t;  var W0 = l - t;
      var x0 = x - X0; var y0 = y - Y0; var z0 = z - Z0; var w0 = w - W0;

      var c1 = (x0 > y0) ? 32 : 0; var c2 = (x0 > z0) ? 16 : 0; var c3 = (y0 > z0) ? 8 : 0;
      var c4 = (x0 > w0) ? 4 : 0;  var c5 = (y0 > w0) ? 2 : 0;  var c6 = (z0 > w0) ? 1 : 0;
      var c = c1 + c2 + c3 + c4 + c5 + c6;

      var i1 = matrix.SIMPLEX[c][0] >= 3 ? 1 : 0;
      var j1 = matrix.SIMPLEX[c][1] >= 3 ? 1 : 0;
      var k1 = matrix.SIMPLEX[c][2] >= 3 ? 1 : 0;
      var l1 = matrix.SIMPLEX[c][3] >= 3 ? 1 : 0;

      var i2 = matrix.SIMPLEX[c][0] >= 2 ? 1 : 0;
      var j2 = matrix.SIMPLEX[c][1] >= 2 ? 1 : 0;
      var k2 = matrix.SIMPLEX[c][2] >= 2 ? 1 : 0;
      var l2 = matrix.SIMPLEX[c][3] >= 2 ? 1 : 0;

      var i3 = matrix.SIMPLEX[c][0] >= 1 ? 1 : 0;
      var j3 = matrix.SIMPLEX[c][1] >= 1 ? 1 : 0;
      var k3 = matrix.SIMPLEX[c][2] >= 1 ? 1 : 0;
      var l3 = matrix.SIMPLEX[c][3] >= 1 ? 1 : 0;

      var x1 = x0 - i1 + G4;
      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2 * G4;
      var y2 = y0 - j2 + 2 * G4;
      var z2 = z0 - k2 + 2 * G4;
      var w2 = w0 - l2 + 2 * G4;
      var x3 = x0 - i3 + 3 * G4;
      var y3 = y0 - j3 + 3 * G4;
      var z3 = z0 - k3 + 3 * G4;
      var w3 = w0 - l3 + 3 * G4;
      var x4 = x0 - 1 + 4 * G4;
      var y4 = y0 - 1 + 4 * G4;
      var z4 = z0 - 1 + 4 * G4;
      var w4 = w0 - 1 + 4 * G4;

      var perm = this._perm;

      var ii = i & 255; var jj = j & 255; var kk = k & 255; var ll = l & 255;
      var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
      var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1+perm[ll + l1]]]] % 32;
      var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2+perm[ll + l2]]]] % 32;
      var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3+perm[ll + l3]]]] % 32;
      var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;

      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) {
          n0 = 0;
      } else {
          t0 *= t0;
          n0 = t0 * t0 * dot.dot4d(matrix.GRAD4[gi0], x0, y0, z0, w0);
      }

      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) {
          n1 = 0;
      } else {
          t1 *= t1;
          n1 = t1 * t1 * dot.dot4d(matrix.GRAD4[gi1], x1, y1, z1, w1);
      }

      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) {
          n2 = 0;
      } else {
          t2 *= t2;
          n2 = t2 * t2 * dot.dot4d(matrix.GRAD4[gi2], x2, y2, z2, w2);
      }

      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) {
          n3 = 0;
      } else {
          t3 *= t3;
          n3 = t3 * t3 * dot.dot4d(matrix.GRAD4[gi3], x3, y3, z3, w3);
      }

      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) {
          n4 = 0;
      } else {
          t4 *= t4;
          n4 = t4 * t4 * dot.dot4d(matrix.GRAD4[gi4], x4, y4, z4, w4);
      }

      return 27 * (n0 + n1 + n2 + n3 + n4);
  }
}

module.exports = SimplexNoise;

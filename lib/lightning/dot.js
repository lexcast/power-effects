module.exports = {
  dot2d: function(g, x, y) {
      return g[0] * x + g[1] * y;
  },

  dot3d: function(g, x, y, z) {
      return g[0] * x + g[1] * y + g[2] * z;
  },

  dot4d: function(g, x, y, z, w) {
      return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
  }
};

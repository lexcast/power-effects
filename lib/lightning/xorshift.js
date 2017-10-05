function Xorshift() {
    var self = this;
    var seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()];

    var x = 123456789;
    var y = 362436069;
    var z = 521288629;
    var w = 88675123;
    var v = 886756453;

    self.uint32 = function() {
        var t = (x ^ (x >>> 7)) >>> 0;
        x = y;
        y = z;
        z = w;
        w = v;
        v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
        return ((y + y + 1) * v) >>> 0;
    };

    self.random = function() {
        return self.uint32() * 2.3283064365386963e-10;
    };

    self.fract53 = function() {
        return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
    };

    for (var i = 0, len = seeds.length, seed; i < len; i++) {
        seed = seeds[i];
        x ^= mash(seed) * 0x100000000;
        y ^= mash(seed) * 0x100000000;
        z ^= mash(seed) * 0x100000000;
        v ^= mash(seed) * 0x100000000;
        w ^= mash(seed) * 0x100000000;
    }
}

// Helper

function mash(data) {
    data = data.toString();
    var n = 0xefc8249d;
    for (var i = 0, len = data.length; i < len; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000;
    }
    return (n >>> 0) * 2.3283064365386963e-10;
}

module.exports = Xorshift;

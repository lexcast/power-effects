/**
 * Catmull-Rom Spline Curve
 *
 * @see http://l00oo.oo00l.com/blog/archives/264
 */
function catmullRom(p0, p1, p2, p3, t) {
    var v0 = (p2 - p0) / 2;
    var v1 = (p3 - p1) / 2;
    return (2 * p1 - 2 * p2 + v0 + v1) * t * t * t
        + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t * t + v0 * t + p1;
}

module.exports = catmullRom;

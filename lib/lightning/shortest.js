function shortest(bases) {
    var points = [bases[0]];
    var p, j, p2, dist, minDist, k;
    for (var i = 0, len = bases.length; i < len; i++) {
        p = bases[i];

        minDist = Infinity;
        k = -1;
        for (j = i; j < len; j++) {
            if ((p2 = bases[j]) !== p && (dist = p.distance(p2)) < minDist) {
                minDist = dist;
                k = j;
            }
        }
        if (k < 0) break;

        points.push(bases[k]);
        i = k - 1;
    }

    return points;
}

module.exports = shortest;

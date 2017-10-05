function random(max, min) {
    if (isNaN(Number(max))) return Math.random();
    if (isNaN(Number(min))) min = 0;
    return Math.random() * (max - min) + min;
}

module.exports = random;

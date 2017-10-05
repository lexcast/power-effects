'use babel';

import catmullRom from './catmull-rom';
import Point from './point';

function spline(controls, segmentsNum) {
    if (controls.length == 0) {
      return [];
    }
    // スプライン補完用に配列の前後にラインの始点, 終点の参照をそれぞれ複製する
    controls.unshift(controls[0]);
    controls.push(controls[controls.length - 1]);

    // スプライン曲線のポイントを取得
    var points = [];
    var p0, p1, p2, p3, t;
    var j;
    for (var i = 0, len = controls.length - 3; i < len; i++) {
        p0 = controls[i];
        p1 = controls[i + 1];
        p2 = controls[i + 2];
        p3 = controls[i + 3];

        for (j = 0; j < segmentsNum; j++) {
            t = (j + 1) / segmentsNum;

            points.push(new Point(
                catmullRom(p0.x, p1.x, p2.x, p3.x, t),
                catmullRom(p0.y, p1.y, p2.y, p3.y, t)
            ));
        }
    }

    // 補完用に追加した参照を削除
    controls.pop();
    // 削除のついでに描画の始点として追加
    points.unshift(controls.shift());

    return points;
}

module.exports = spline;

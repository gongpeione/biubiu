import zrender from 'zrender';


// const zr = zrender.init(document.querySelector('main'), { renderer: 'svg' });
const zr = zrender.init(document.querySelector('main'));
const w = zr.getWidth();
const h = zr.getHeight();
const pool = [];

for (let i = 0; i < 100; i++) {
    const randomY = h * Math.random();
    const txt = new zrender.Text({
        style: {
            text: 'zrender ' + i,
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fontSize: 20,
            fontFamily: 'Lato',
            fontWeight: 'bolder',
            textFill: '#0ff',
            blend: 'lighten'
        },
        position: [w * 2, randomY]
    });
    zr.add(txt);
    pool.push({
        el: txt,
        y: randomY
    });
}

function loop ({el, y}) {
    const txtRect = el.getBoundingRect();
    el.attr('position', [w * 2, y]);
    el.animateTo({
        position: [-txtRect.width, y]
    }, 3000, 1000 * Math.random());
}
pool.forEach(loop);

setTimeout(() => {
    pool.forEach(loop);
}, 5000);
import zrender from 'zrender';


const zr = zrender.init(document.querySelector('main'), { renderer: 'svg' });
// const zr = zrender.init(document.querySelector('main'));
const w = zr.getWidth();
const h = zr.getHeight();
const barragePool = [];
const elPool = [];

class ContentQueue {
    private pool = [];
    getOne () {
        if (!this.pool.length) return null;
        return this.pool.splice(this.pool.length - 1, 1);
    }
    add (content) {
        this.pool.push(content);
    }
}

class BarragePool {
    private pool = [];
    
    public size: number = 0;

    constructor (size) {
        this.size = size;
    }

    init () {
        for (let i = 0; i < this.size; i++) {
            const randomY = h * Math.random();
            const txt = new zrender.Text({
                style: {
                    text: 'zrender',
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
            this.pool.push({
                el: txt,
                y: randomY
            });
        }
    }

    *[Symbol.iterator] () {
        const l = this.pool.length;
        for (let i = 0; i < l; i++) {
            yield this.pool[i];
        }
    }
}

class BarrageManager {

}

for (let i = 0; i < 50; i++) {
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
    elPool.push({
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
elPool.forEach(loop);

setTimeout(() => {
    elPool.forEach(loop);
}, 5000);
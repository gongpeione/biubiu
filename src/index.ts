import zrender from 'zrender';
import { EventEmitter } from 'events';

const zr = zrender.init(document.querySelector('main .barrage'), { renderer: 'svg' });
// const zr = zrender.init(document.querySelector('main'));
const w = zr.getWidth();
const h = zr.getHeight();
const barragePool = [];
const elPool = [];

interface Content {
    txt: string,
    style: string | [any] | {},
    time: number
}
class ContentQueue extends EventEmitter {
    private queue: Content[] = [];
    // private timer;

    constructor () {
        super();
        (this as EventEmitter).on('timeupdate', (e) => {
            console.log(e.timeStamp);
        });
    }
    getOne () {
        if (!this.queue.length) return null;
        return this.queue.splice(this.queue.length - 1, 1);
    }
    add (content) {
        this.queue.push(content);
    }
    // startTimer () {
    //     !this.timer && (this.timer = requestAnimationFrame(this.walkQueue.bind(this)));
    // }
    // stopTimer () {
    //     cancelAnimationFrame(this.timer);
    // }
    walkQueue () {
        
    }
}

interface Barrage {
    el,
    y: number,
    free?: boolean;
}
class BarragePool extends EventEmitter {
    private pool: Barrage[] = [];
    private queue = [];
    private loop: number;
    
    public size: number = 0;

    constructor (size) {
        super();
        this.size = size;
        (this as EventEmitter).on('pause', (e) => {
            const l = this.pool.length;
            for (let i = 0; i < l; i++) {
                if (this.pool[i].free) continue;
                this.pool[i].el.pause();
            }
        });
        (this as EventEmitter).on('play', (e) => {
            const l = this.pool.length;
            for (let i = 0; i < l; i++) {
                if (this.pool[i].free) continue;
                this.pool[i].el.resume();
            }
        });
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

    // Send a barrage
    biu (opt) {
        const barrage = this.getFreeOne();
        if (!barrage) {
            this.queue.push(opt);
            !this.loop && (this.loop = requestAnimationFrame(this.walkQueue.bind(this)));
            return;
        }
    }

    walkQueue () {
        if (!this.queue.length) {
            cancelAnimationFrame(this.loop);
            return;
        }
        this.biu(this.queue.shift());
    }

    getFreeOne () {
        const l = this.pool.length;
        for (let i = 0; i < l; i++) {
            if (this.pool[i].free) {
                return this.pool[i];
            }
        }
        return null;
    }

    *[Symbol.iterator] () {
        const l = this.pool.length;
        for (let i = 0; i < l; i++) {
            yield this.pool[i];
        }
    }
}

class BarrageManager {
    public w: number;
    public h: number;
    private canvas;
    private video: HTMLVideoElement;
    private opt;
    private barrage: BarragePool;
    private content: ContentQueue;
    constructor (canvas, video, opt?) {
        this.opt = opt || {};
        this.canvas = zrender.init(
            document.querySelector(canvas), 
            { 
                renderer: this.opt.renderer || 'canvas' 
            }
        );
        this.video = document.querySelector(video);
        this.video.addEventListener('timeupdate', (e) => {
            (this.content as EventEmitter).emit('timeupdate', e);
        });
        this.video.addEventListener('pause', (e) => {
            (this.barrage as EventEmitter).emit('pause', e);
        });
        this.video.addEventListener('play', (e) => {
            (this.barrage as EventEmitter).emit('play', e);
        });
        this.barrage = new BarragePool(20);
        this.content = new ContentQueue();
    }
}

new BarrageManager('main .barrage', 'main video');

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
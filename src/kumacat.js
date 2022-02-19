'use strict';

const can = document.createElement('canvas');
const con = can.getContext('2d');

let fontname = 'monospace';

(function loop() {
    can.width = innerWidth;
    can.height = innerHeight;
    requestAnimationFrame(loop);
})();

let stage = {
    bgc: [],
    img: [],
    txt: [],
    fil: [],
    remove: function (target, start, range) {
        let data;
        switch (target) {
            case 'bgc':
                data = stage.bgc.splice(start, range);
                for (let n = 0; n < data.length; n++) {
                    data[n].remove();
                }
                return data;
            case 'img':
                data = stage.img.splice(start, range);
                for (let n = 0; n < data.length; n++) {
                    data[n].remove();
                }
                return data;
            case 'txt':
                data = stage.txt.splice(start, range);
                for (let n = 0; n < data.length; n++) {
                    data[n].remove();
                }
                return data;
            case 'fil':
                data = stage.fil.splice(start, range);
                for (let n = 0; n < data.length; n++) {
                    data[n].remove();
                }
                return data;
            case 'all':
                data = {
                    bgc: stage.remove('bgc', 0, stage.bgc.length),
                    fil: stage.remove('fil', 0, stage.fil.length),
                    img: stage.remove('img', 0, stage.img.length),
                    txt: stage.remove('txt', 0, stage.txt.length)
                };
                return data;
        }
    }
};

class imgdraw {
    constructor(im, x, y, w, anchor) {
        this.im = im;
        this.x = x;
        this.y = y;
        this.w = w;
        this.dfw = w;
        this.run = true;
        this.event = false;
        this.click = false;
        this.down = false;
        this.up = false;
        this.alup = false;
        this.out = false;
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
        let canvas = document.createElement('canvas');
        canvas.width = img[this.im].w;
        canvas.height = img[this.im].h;
        let context = canvas.getContext('2d');
        context.drawImage(img[img[this.im].i], img[this.im].x, img[this.im].y, img[this.im].w, img[this.im].h, 0, 0, canvas.width, canvas.height);
        this.context = context;
        stage.img.push(this);
        this.loop();
    }
    loop() {
        if (this.run) {
            con.drawImage(img[img[this.im].i], img[this.im].x, img[this.im].y, img[this.im].w, img[this.im].h, can.width / 100 * this.x - can.width / 100 * this.w * this.a[0], can.height / 100 * this.y - can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1], can.width / 100 * this.w, can.width / 100 * this.w / img[this.im].w * img[this.im].h);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setposition(x, y) {
        this.x = x;
        this.y = y;
    }
    setwidth(w) {
        this.w = w;
        this.dfw = w;
    }
    setanchor(anchor) {
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
    }
    onclick(func) {
        this.click = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    ondown(func) {
        this.down = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    onup(func) {
        this.up = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    outof(func) {
        this.out = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    allup(func) {
        this.alup = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    eventdown(e) {
        if (this.run && this.event) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            this.eventtrue = false;
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1] && can.height / 100 * this.y - can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1] + can.width / 100 * this.w / img[this.im].w * img[this.im].h > y) {
                if (this.context.getImageData((x - can.width / 100 * this.x + can.width / 100 * this.w * this.a[0]) / (can.width / 100 * this.w) * img[this.im].w, (y - can.height / 100 * this.y + can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1]) / (can.width / 100 * this.w / img[this.im].w * img[this.im].h) * img[this.im].h, 1, 1).data[3] === 255) {
                    if (this.down) {
                        this.down(x, y);
                    }
                    this.w = this.dfw - 1;
                    this.eventtrue = true;
                }
            }
        }
    }
    eventup(e) {
        if (this.run && this.event) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            this.w = this.dfw;
            if (this.alup) {
                this.alup(x, y);
            }
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1] && can.height / 100 * this.y - can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1] + can.width / 100 * this.w / img[this.im].w * img[this.im].h > y) {
                if (this.context.getImageData((x - can.width / 100 * this.x + can.width / 100 * this.w * this.a[0]) / (can.width / 100 * this.w) * img[this.im].w, (y - can.height / 100 * this.y + can.width / 100 * this.w / img[this.im].w * img[this.im].h * this.a[1]) / (can.width / 100 * this.w / img[this.im].w * img[this.im].h) * img[this.im].h, 1, 1).data[3] === 255) {
                    if (this.eventtrue && this.click) {
                        this.click(x, y);
                    }
                    if (this.up) {
                        this.up(x, y);
                    }
                }
            }
            this.eventtrue = false;
        }
    }
    eventout() {
        if (this.run && this.event && this.eventtrue) {
            this.w = this.dfw;
            if (this.out) {
                this.out();
            }
        }
    }
    remove() {
        this.run = false;
    }
}

class urlimg {
    constructor(url, sx, sy, iw, ih, x, y, w, anchor) {
        this.sx = sx;
        this.sy = sy;
        this.iw = iw;
        this.ih = ih;
        this.x = x;
        this.y = y;
        this.w = w;
        let img = new Image();
        img.src = url;
        this.i = img;
        this.run = true;
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
        stage.img.push(this);
        this.loop();
    }
    loop() {
        if (this.run) {
            con.drawImage(this.i, this.sx, this.sy, this.iw, this.ih, can.width / 100 * this.x - can.width / 100 * this.w * this.a[0], can.height / 100 * this.y - can.width / 100 * this.w / this.iw * this.ih * this.a[1], can.width / 100 * this.w, can.width / 100 * this.w / this.iw * this.ih);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setposition(x, y) {
        this.x = x;
        this.y = y;
    }
    setwidth(w) {
        this.w = w;
    }
    setanchor(anchor) {
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
    }
    remove() {
        this.run = false;
    }
}

class filldraw {
    constructor(x, y, w, h, color, anchor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dfw = w;
        this.dfh = h;
        this.c = color;
        this.run = true;
        this.event = false;
        this.click = false;
        this.down = false;
        this.up = false;
        this.alup = false;
        this.out = false;
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
        stage.fil.push(this);
        this.loop();
    }
    loop() {
        if (this.run) {
            con.fillStyle = this.c;
            con.fillRect(can.width / 100 * this.x - can.width / 100 * this.w * this.a[0], can.height / 100 * this.y - can.height / 100 * this.h * this.a[1], can.width / 100 * this.w, can.height / 100 * this.h);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setposition(x, y) {
        this.x = x;
        this.y = y;
    }
    setscale(w, h) {
        this.w = w;
        this.h = h;
        this.dfw = w;
        this.dfh = h;
    }
    setanchor(anchor) {
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
    }
    setcolor(color) {
        this.c = color;
    }
    onclick(func) {
        this.click = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    ondown(func) {
        this.down = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    onup(func) {
        this.up = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    outof(func) {
        this.out = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    allup(func) {
        this.alup = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    eventdown(e) {
        if (this.run && this.event) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            this.eventtrue = false;
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.height / 100 * this.h * this.a[1] && can.height / 100 * this.y - can.height / 100 * this.h * this.a[1] + can.height / 100 * this.h > y) {
                if (this.down) {
                    this.down(x, y);
                }
                this.w = this.dfw - 1;
                this.h = this.dfh - 1;
                this.eventtrue = true;
            }
        }
    }
    eventup(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (this.run && this.event) {
            this.w = this.dfw;
            this.h = this.dfh;
            if (this.alup) {
                this.alup(x, y);
            }
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.height / 100 * this.h * this.a[1] && can.height / 100 * this.y - can.height / 100 * this.h * this.a[1] + can.height / 100 * this.h > y) {
                if (this.eventtrue && this.click) {
                    this.click(x, y);
                }
                if (this.up) {
                    this.up(x, y);
                }
            }
            this.eventtrue = false;
        }
    }
    eventout() {
        if (this.run && this.event && this.eventtrue) {
            this.w = this.dfw;
            this.h = this.dfh;
            if (this.out) {
                this.out();
            }
        }
    }
    remove() {
        this.run = false;
    }
}

class fillagst {
    constructor(x, y, w, against, color, anchor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = against;
        this.dfw = w;
        this.c = color;
        this.run = true;
        this.event = false;
        this.click = false;
        this.down = false;
        this.up = false;
        this.alup = false;
        this.out = false;
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
        stage.fil.push(this);
        this.loop();
    }
    loop() {
        if (this.run) {
            con.fillStyle = this.c;
            con.fillRect(can.width / 100 * this.x - can.width / 100 * this.w * this.a[0], can.height / 100 * this.y - can.width / 100 * this.w * this.h * this.a[1], can.width / 100 * this.w, can.width / 100 * this.w * this.h);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setposition(x, y) {
        this.x = x;
        this.y = y;
    }
    setscale(w, against) {
        this.w = w;
        this.h = against;
        this.dfw = w;
    }
    setanchor(anchor) {
        if (Array.isArray(anchor)) {
            this.a = anchor;
        } else {
            this.a = [anchor, anchor];
        }
    }
    setcolor(color) {
        this.c = color;
    }
    onclick(func) {
        this.click = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    ondown(func) {
        this.down = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    onup(func) {
        this.up = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    outof(func) {
        this.out = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    allup(func) {
        this.alup = func;
        this.eventtrue = false;
        if (this.event !== true) {
            this.event = true;
            can.addEventListener('pointerdown', this.eventdown.bind(this));
            can.addEventListener('pointerup', this.eventup.bind(this));
            can.addEventListener('pointerout', this.eventout.bind(this));
        }
    }
    eventdown(e) {
        if (this.run && this.event) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            this.eventtrue = false;
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.width / 100 * this.w * this.h * this.a[1] && can.height / 100 * this.y - can.width / 100 * this.w * this.h * this.a[1] + can.width / 100 * this.w * this.h > y) {
                if (this.down) {
                    this.down(x, y);
                }
                this.w = this.dfw - 1;
                this.eventtrue = true;
            }
        }
    }
    eventup(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (this.run && this.event) {
            this.w = this.dfw;
            if (this.alup) {
                this.alup(x, y);
            }
            if (x > can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] && can.width / 100 * this.x - can.width / 100 * this.w * this.a[0] + can.width / 100 * this.w > x && y > can.height / 100 * this.y - can.width / 100 * this.w * this.h * this.a[1] && can.height / 100 * this.y - can.width / 100 * this.w * this.h * this.a[1] + can.width / 100 * this.w * this.h > y) {
                if (this.eventtrue && this.click) {
                    this.click(x, y);
                }
                if (this.up) {
                    this.up(x, y);
                }
            }
            this.eventtrue = false;
        }
    }
    eventout() {
        if (this.run && this.event && this.eventtrue) {
            this.w = this.dfw;
            if (this.out) {
                this.out();
            }
        }
    }
    remove() {
        this.run = false;
    }
}

class bgcolor {
    constructor(color) {
        this.c = color;
        this.run = true;
        this.loop();
        stage.bgc.push(this);
    }
    loop() {
        if (this.run) {
            con.fillStyle = this.c;
            con.fillRect(0, 0, can.width, can.height);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setcolor(color) {
        this.c = color;
    }
    remove() {
        this.run = false;
    }
}

class txtdraw {
    constructor(text, x, y, scolor, fcolor, maxwidth) {
        this.x = x;
        this.y = y;
        this.t = text;
        this.sc = scolor;
        this.fc = fcolor;
        this.max = (maxwidth === 'auto') ? 999999999 : maxwidth;
        this.run = true;
        stage.txt.push(this);
        this.loop();
    }
    loop() {
        if (this.run) {
            con.lineWidth = Math.round(can.height / 120);
            con.lineJoin = "miter";
            con.strokeStyle = this.sc;
            con.fillStyle = this.fc;
            con.font = can.height / 20 + 'px "' + fontname + '"';
            con.strokeText(this.t, can.width / 100 * this.x, can.height / 100 * this.y, can.width / 100 * this.max);
            con.fillText(this.t, can.width / 100 * this.x, can.height / 100 * this.y, can.width / 100 * this.max);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    setcolor(scolor, fcolor) {
        this.sc = scolor;
        this.fc = fcolor;
    }
    setposition(x, y, maxwidth) {
        this.x = x;
        this.y = y;
        this.max = maxwidth;
    }
    remove() {
        this.run = false;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(can);
});
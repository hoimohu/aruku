const {
    ipcRenderer
} = require('electron')

let map;
let first = true;
let keyboard = true;

let myip;
let connect_ip;

let sock;

let message_list = {};

function connect_ws() {
    sock = new WebSocket("ws://" + connect_ip + ":8080");
    sock.addEventListener("open", e => {
        sock.send(JSON.stringify({
            ip: myip,
            type: 'get',
            target: 'all'
        }));
    });
    sock.addEventListener("message", e => {
        const data = JSON.parse(e.data);
        if (first && data.type === 'alldata') {
            map = data;
            first = false;
            if (typeof map.player[myip.split('.').join('_')] === 'undefined') {
                map.player[myip.split('.').join('_')] = {
                    x: 0,
                    mj: 0,
                    re: 0
                };
                sock.send(JSON.stringify({
                    ip: myip,
                    type: 'send',
                    target: 'x',
                    data: 0
                }));
                sock.send(JSON.stringify({
                    ip: myip,
                    type: 'send',
                    target: 'mj',
                    data: 0
                }));
                sock.send(JSON.stringify({
                    ip: myip,
                    type: 'send',
                    target: 're',
                    data: 0
                }));
            }
            start();
            let inp = document.createElement('input');
            inp.style = 'bottom:0%;';
            inp.classList.add('textinput');
            inp.setAttribute('placeholder', '伝えたいメッセージを入力してEnterキー');
            document.body.appendChild(inp);
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = inp.value;
                    inp.value = '';
                    if (val != '' && val != null) {
                        sock.send(JSON.stringify({
                            ip: myip,
                            type: 'send',
                            target: 'message',
                            'data': val
                        }));
                    }
                }
            });
            inp.addEventListener('click', () => {
                keyboard = false;
                inp.setAttribute('placeholder', '入力中はキャラクターを操作できません');
            });
            can.addEventListener('click', () => {
                keyboard = true;
                inp.setAttribute('placeholder', '伝えたいメッセージを入力してEnterキー');
            });
        }
        if (data.type === 'message') {
            let n = 0;
            let sc = '#000';
            let fc = '#fff';
            if (data.server === 1) {
                sc = '#fff';
                fc = '#00f';
            }
            (function loop() {
                if (message_list[n] > 30) {
                    n++;
                    loop();
                } else {
                    if (typeof message_list[n] === 'undefined') {
                        message_list[n] = data.data.length + data.ip.length + 4;
                    } else {
                        message_list[n] += data.data.length + data.ip.length + 4;
                    }
                    let t = new txtdraw('[' + data.ip + 'より]' + data.data, 100, 5 + n * 5, sc, fc, 'auto');
                    let inter = setInterval(() => {
                        if (t.x > -5 * (data.data.length + data.ip.length + 4)) {
                            t.x -= 0.3;
                        } else {
                            message_list[n] -= data.data.length;
                            t.remove();
                            clearInterval(inter);
                        }
                    }, 50 / (data.data.length + data.ip.length + 4) * 6);
                }
            })();
        }
    });
    sock.addEventListener("close", e => {
        new txtdraw('接続が切断されました', 10, 20, '#6df', '#fff', 100);
    });
    sock.addEventListener("error", e => {
        new txtdraw('接続エラーが発生しました', 10, 30, '#f00', '#fff', 100);
    });
}

function topmenu() {
    ipcRenderer.invoke('invoke-getip').then(data => {
        myip = data;
        new txtdraw('歩く', 10, 10, '#000', '#000', 100);
        let makeserver = new imgdraw('makeserver', 50, 50, 80, 0.5);
        let inserver = new imgdraw('inserver', 50, 70, 80, 0.5);
        makeserver.onclick(() => {
            stage.remove('all');
            new txtdraw('マイサーバー接続中...', 10, 10, '#000', '#000', 100);
            let cl = new imgdraw('closebtn', 50, 90, 80, 0.5);
            cl.onclick(() => {
                ipcRenderer.invoke('invoke-quit', 'quit');
            });
            connect_ip = data;
            connect_ws();
        });
        inserver.onclick(() => {
            stage.remove('all');
            let inp = document.createElement('input');
            inp.style = 'top:20%;';
            inp.classList.add('textinput');
            inp.setAttribute('placeholder', 'サーバーのホスト情報を入力(例:' + myip + ')');
            document.body.appendChild(inp);
            let co_ws = new imgdraw('connectws', 50, 50, 60, 0.5);
            co_ws.onclick(() => {
                stage.remove('all');
                inp.remove();
                connect_ip = inp.value;
                new txtdraw('サーバー接続中...', 10, 10, '#000', '#000', 100);
                let cl = new imgdraw('closebtn', 50, 90, 80, 0.5);
                cl.onclick(() => {
                    ipcRenderer.invoke('invoke-quit', 'quit');
                });
                connect_ws();
            });
        });
    });
}

function start() {
    stage.remove('all');
    let x = map.player[myip.split('.').join('_')].x;
    let run = true;
    let first = true;
    let bomtime = false;
    let bomok = true;
    let lasthuman = 'righthuman';
    let arukutime = false;
    let arukutime2 = false;
    new bgcolor('#6e0');
    let human = new imgdraw('righthuman', 50, 50, 10, 0.5);
    let info = new txtdraw('[' + connect_ip + ']x: ' + x, 2, 5, '#000', '#000', 'auto');
    let manju = new txtdraw('MANJU: ' + map.player[myip.split('.').join('_')].mj, 2, 11, '#000', '#000', 'auto');
    let bominfo = new txtdraw('bom: Ready', 2, 17, '#000', '#000', 'auto');
    var right = false;
    var left = false;
    map.mapenemy = {};
    map.mapobj = {};

    render();

    (function loop() {
        if (run) {
            if (map.enemy[x] != null) {
                gameover();
            } else {
                if (map.obj[x] != null) {
                    if (map.obj[x] === 'tree') {
                        sock.send(JSON.stringify({
                            ip: myip,
                            type: 'send',
                            target: 're',
                            data: map.player[myip.split('.').join('_')].x
                        }));
                        map.player[myip.split('.').join('_')].re = x;
                    }
                }
                setTimeout(() => {
                    loop();
                }, 1000);
            }
        }
    })();

    function gameover() {
        run = false;
        let over = true;
        setTimeout(() => {
            stage.remove('all');
            new bgcolor('#000');
            new txtdraw('GAME OVER(' + map.player[myip.split('.').join('_')].mj + ' MANJU)', 5, 50, '#fff', '#fff', 90);
            sock.send(JSON.stringify({
                ip: myip,
                type: 'send',
                target: 'gameover',
                data: [map.player[myip.split('.').join('_')].x, map.player[myip.split('.').join('_')].mj, map.player[myip.split('.').join('_')].re]
            }));
            sock.send(JSON.stringify({
                ip: myip,
                type: 'send',
                target: 'mj',
                data: 0
            }));
            sock.send(JSON.stringify({
                ip: myip,
                type: 'send',
                target: 'x',
                data: map.player[myip.split('.').join('_')].re
            }));
            map.player[myip.split('.').join('_')].x = map.player[myip.split('.').join('_')].re;
            new txtdraw('Replay?', 20, 70, '#fff', '#fff', 60);
            document.addEventListener('click', () => {
                if (over) {
                    over = false;
                    start();
                }
            });
        }, 1);
    }

    sock.addEventListener("message", e => {
        if (run) {
            const data = JSON.parse(e.data);
            if (data.type === 'player_x') {
                map.player[data.ip.split('.').join('_')].x = data.data;
                if (data.ip === myip) {
                    x = data.data;
                }
            } else if (data.type === 'player_mj') {
                map.player[data.ip.split('.').join('_')].mj = data.data;
            } else if (data.type === 'enemy') {
                map.enemy[data.data] = 'fish';
            } else if (data.type === 'killenemy') {
                delete map.enemy[data.data];
                delete map.mapenemy[data.data];
            }
        }
    });

    function infotext(i, num) {
        switch (i) {
            case 'x':
                sock.send(JSON.stringify({
                    ip: myip,
                    type: 'send',
                    target: 'x',
                    data: map.player[myip.split('.').join('_')].x + num
                }));
                x += num;
                info.t = '[' + connect_ip + ']x: ' + x;
                break;
            case 'mj':
                sock.send(JSON.stringify({
                    ip: myip,
                    type: 'send',
                    target: 'mj',
                    data: map.player[myip.split('.').join('_')].mj + num
                }));
                manju.t = 'MANJU: ' + (map.player[myip.split('.').join('_')].mj + num);
                break;
            case 'b':
                bominfo.t = (bomok === true) ? 'bom: Ready' : 'bom: just a moment';
                break;
        }
    }

    function aruku() {
        if (run && arukutime === true || arukutime2 === true || first) {
            let localx = x;
            first = false;
            if (bomtime) {
                human.im = lasthuman;
                human.w = 10;
                setTimeout(() => {
                    bomtime = false;
                    setTimeout(() => {
                        bomok = true;
                        infotext('b');
                    }, 1500);
                }, 500);
            }
            arukutime2 = true;

            function sett() {
                setTimeout(() => {
                    if (arukutime === false && localx === x) {
                        arukutime = true;
                        aruku();
                    }
                }, 1000);
            }
            if (right === true && left === false) {
                human.im = 'righthuman';
                lasthuman = 'righthuman';
                arukutime = false;
                arukutime2 = false;
                infotext('x', 1);
                localx++;
                render('rw');
                sett();
            } else if (right === false && left === true) {
                human.im = 'lefthuman';
                lasthuman = 'lefthuman';
                arukutime = false;
                arukutime2 = false;
                infotext('x', -1);
                localx--;
                render('lw');
                sett();
            } else if (right === true && left === true && bomok) {
                human.im = 'bom';
                human.w = 50;
                bomtime = true;
                arukutime = false;
                arukutime2 = false;
                bomok = false;
                infotext('b');
                render('bom');
                sett();
            }
        }
    }

    function kdown(e) {
        if (run && keyboard) {
            if ((e.key == "Right" || e.key == "ArrowRight") && (left === true || arukutime2 || first) && bomtime !== true) {
                right = true;
                aruku();
            } else if ((e.key == "Left" || e.key == "ArrowLeft") && (right === true || arukutime2 || first) && bomtime !== true) {
                left = true;
                aruku();
            }
        }
    }

    function kup(e) {
        if (run && keyboard) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                right = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                left = false;
            }
        }
    }

    function render(key) {
        if (run) {
            function move(xn) {
                let count = 0;
                switch (key) {
                    case 'rw':
                        (function () {
                            if (human.im === 'bom') {
                                human.remove();
                                human = new imgdraw('bom', 50, 50, 50, 0.5);
                            } else {
                                human.remove();
                                human = new imgdraw('righthuman', 50, 50, 10, 0.5);
                            }
                            let int = setInterval(() => {
                                if (run) {
                                    if (count === 10) {
                                        human.im = (human.im === 'bom') ? 'bom' : 'righthuman';
                                        clearInterval(int);
                                    } else {
                                        if (count === 10 / 4) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'righthuman2';
                                        } else if (count === 10 / 2) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'righthuman';
                                        } else if (count === 30 / 4) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'righthuman2';
                                        }
                                        map.mapobj[xn].x -= 10 / 40;
                                        count += 10 / 40;
                                    }
                                }
                            }, 1000 / 40);
                        })();
                        break;
                    case 'lw':
                        (function () {
                            if (human.im === 'bom') {
                                human.remove();
                                human = new imgdraw('bom', 50, 50, 50, 0.5);
                            } else {
                                human.remove();
                                human = new imgdraw('lefthuman', 50, 50, 10, 0.5);
                            }
                            let int = setInterval(() => {
                                if (run) {
                                    if (count === 10) {
                                        human.im = (human.im === 'bom') ? 'bom' : 'lefthuman';
                                        clearInterval(int);
                                    } else {
                                        if (count === 10 / 4) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'lefthuman2';
                                        } else if (count === 10 / 2) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'lefthuman';
                                        } else if (count === 30 / 4) {
                                            human.im = (human.im === 'bom') ? 'bom' : 'lefthuman2';
                                        }
                                        map.mapobj[xn].x += 10 / 40;
                                        count += 10 / 40;
                                    }
                                }
                            }, 1000 / 40);
                        })();
                        break;
                }
            }

            function move_en(xn) {
                let count = 0;
                switch (key) {
                    case 'rw':
                        (function () {
                            let int = setInterval(() => {
                                if (run) {
                                    if (count === 10) {
                                        clearInterval(int);
                                    } else {
                                        map.mapenemy[xn].x -= 10 / 40;
                                        count += 10 / 40;
                                    }
                                }
                            }, 1000 / 40);
                        })();
                        break;
                    case 'lw':
                        (function () {
                            let int = setInterval(() => {
                                if (run) {
                                    if (count === 10) {
                                        clearInterval(int);
                                    } else {
                                        map.mapenemy[xn].x += 10 / 40;
                                        count += 10 / 40;
                                    }
                                }
                            }, 1000 / 40);
                        })();
                        break;
                }
            }
            switch (key) {
                case 'bom':
                    for (let n = -2; n < 3; n++) {
                        if (map.mapenemy[x + n] != null) {
                            map.mapenemy[x + n].remove();
                            sock.send(JSON.stringify({
                                ip: myip,
                                type: 'send',
                                target: 'killenemy',
                                data: x + n
                            }));
                            switch (map.mapenemy[x + n].im) {
                                case 'fish':
                                    infotext('mj', 50);
                                    break;
                            }
                            delete map.enemy[x + n];
                            delete map.mapenemy[x + n];
                        }
                    }
                    break;
                case 'rw':
                    for (let n = -8; n < 7; n++) {
                        if (map.mapobj[x + n] != null) {
                            if (n === -8) {
                                map.mapobj[x + n].remove();
                                delete map.mapobj[x + n];
                            } else {
                                move(x + n);
                            }
                        } else if (map.mapenemy[x + n] != null) {
                            if (n === -8) {
                                map.mapenemy[x + n].remove();
                                delete map.mapenemy[x + n];
                            } else {
                                move_en(x + n);
                            }
                        } else {
                            if (n === 6) {
                                if (((x + n) % 100 === 0) && !(map.obj[x + n] != null)) {
                                    map.obj[x + n] = 'tree';
                                }
                                if (((x + n) % 5 === 1 || (x + n) % 5 === -4) && !(map.obj[x + n] != null)) {
                                    map.obj[x + n] = 'grass';
                                }
                                if (map.obj[x + n] != null) {
                                    let o = new imgdraw(map.obj[x + n], 50 + n * 10, 50, 15, [0.4, 1]);
                                    map.mapobj[x + n] = o;
                                }
                                if ((Math.random() + '').slice(0, 3) === '0.1' && !(map.enemy[x + n] != null) && !(map.obj[x + n] != null) && !((x + n) % 100 === 0)) {
                                    map.enemy[x + n] = 'fish';
                                    sock.send(JSON.stringify({
                                        ip: myip,
                                        type: 'send',
                                        target: 'enemy',
                                        data: x + n
                                    }));
                                }
                                if (map.enemy[x + n] != null) {
                                    let o = new imgdraw(map.enemy[x + n], 50 + n * 10, 50, 15, 0.5);
                                    map.mapenemy[x + n] = o;
                                }
                            }
                        }
                    }
                    break;
                case 'lw':
                    for (let n = -7; n < 9; n++) {
                        if (map.mapobj[x + n] != null) {
                            if (n === 8) {
                                map.mapobj[x + n].remove();
                                delete map.mapobj[x + n];
                            } else {
                                move(x + n);
                            }
                        } else if (map.mapenemy[x + n] != null) {
                            if (n === 8) {
                                map.mapenemy[x + n].remove();
                                delete map.mapenemy[x + n];
                            } else {
                                move_en(x + n);
                            }
                        } else {
                            if (n === -7) {
                                if (((x + n) % 100 === 0) && !(map.obj[x + n] != null)) {
                                    map.obj[x + n] = 'tree';
                                }
                                if (((x + n) % 5 === 1 || (x + n) % 5 === -4) && !(map.obj[x + n] != null)) {
                                    map.obj[x + n] = 'grass';
                                }
                                if (map.obj[x + n] != null) {
                                    let o = new imgdraw(map.obj[x + n], 50 + n * 10, 50, 15, [0.4, 1]);
                                    map.mapobj[x + n] = o;
                                }
                                if ((Math.random() + '').slice(0, 3) === '0.1' && !(map.enemy[x + n] != null) && !(map.obj[x + n] != null) && !((x + n) % 100 === 0)) {
                                    map.enemy[x + n] = 'fish';
                                    sock.send(JSON.stringify({
                                        ip: myip,
                                        type: 'send',
                                        target: 'enemy',
                                        data: x + n
                                    }));
                                }
                                if (map.enemy[x + n] != null) {
                                    let o = new imgdraw(map.enemy[x + n], 50 + n * 10, 50, 15, 0.5);
                                    map.mapenemy[x + n] = o;
                                }
                            }
                        }
                    }
                    break;
                default:
                    for (let n = -7; n < 8; n++) {
                        if (((x + n) % 100 === 0) && !(map.obj[x + n] != null)) {
                            map.obj[x + n] = 'tree';
                        }
                        if (((x + n) % 5 === 1 || (x + n) % 5 === -4) && !(map.obj[x + n] != null)) {
                            map.obj[x + n] = 'grass';
                        }
                        if (map.obj[x + n] != null) {
                            let o = new imgdraw(map.obj[x + n], 50 + n * 10, 50, 15, [0.4, 1]);
                            map.mapobj[x + n] = o;
                        }
                        if (map.enemy[x + n] != null) {
                            let o = new imgdraw(map.enemy[x + n], 50 + n * 10, 50, 15, 0.5);
                            map.mapenemy[x + n] = o;
                        }
                    }
                    break;
            }
        }
    }
    document.addEventListener("keydown", kdown, false);
    document.addEventListener("keyup", kup, false);
}

window.onload = topmenu;
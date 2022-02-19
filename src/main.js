const {
    app,
    ipcMain,
    BrowserWindow
} = require('electron')

const fs = require("fs");

const dire = app.getPath('home') + '/aruku_gamedata/';

var os = require('os');

var ipv4address;

var interfaces = os.networkInterfaces();

for (var dev in interfaces) {
    interfaces[dev].forEach(function (details) {
        if (!details.internal) {
            switch (details.family) {
                case "IPv4":
                    ipv4address = details.address;
                    break;
            }
        }
    });
}

let mgs = {
    obj: {},
    enemy: {},
    player: {},
    mapobj: {},
    mapenemy: {},
    mapplayer: {},
    type: 'alldata'
};


const server = require("ws").Server;
const s = new server({
    port: 8080
});

s.on("connection", ws => {
    ws.on("message", message => {
        const ms = JSON.parse(message.toString());
        console.log(ms);
        if (ms.type === 'get') {
            if (ms.target === 'x') {
                ws.send(JSON.stringify({
                    obj: mgs.obj[ms.data],
                    enemy: mgs.enemy[ms.data]
                }));
            } else if (ms.target === 'all') {
                ws.send(JSON.stringify(mgs));
            }
        } else if (ms.type === 'send') {
            if (ms.target === 'x') {
                if (typeof mgs.player[ms.ip.split('.').join('_')] === 'undefined') {
                    mgs.player[ms.ip.split('.').join('_')] = {};
                }
                mgs.player[ms.ip.split('.').join('_')].x = ms.data;
                let sendata = {
                    type: 'player_x',
                    ip: ms.ip,
                    data: ms.data
                };
                s.clients.forEach(client => {
                    client.send(JSON.stringify(sendata));
                });
            } else if (ms.target === 'mj') {
                mgs.player[ms.ip.split('.').join('_')].mj = ms.data;
                let sendata = {
                    type: 'player_mj',
                    ip: ms.ip,
                    data: ms.data
                };
                s.clients.forEach(client => {
                    client.send(JSON.stringify(sendata));
                });
            } else if (ms.target === 'enemy') {
                mgs.enemy[ms.data] = 'fish';
                let sendata = {
                    type: 'enemy',
                    data: ms.data
                };
                s.clients.forEach(client => {
                    client.send(JSON.stringify(sendata));
                });
            } else if (ms.target === 're') {
                mgs.player[ms.ip.split('.').join('_')].re = ms.data;
            } else if (ms.target === 'killenemy') {
                delete mgs.enemy[ms.data];
                let sendata = {
                    type: 'killenemy',
                    data: ms.data
                };
                s.clients.forEach(client => {
                    client.send(JSON.stringify(sendata));
                });
                setTimeout(() => {
                    let sendata2 = {
                        ip: 'サーバー',
                        type: 'message',
                        data: '座標x:' + ms.data + 'で[' + ms.ip + ']が敵を討伐、' + mgs.player[ms.ip.split('.').join('_')].mj + 'MANJUになりました。',
                        server: 1
                    };
                    s.clients.forEach(client => {
                        client.send(JSON.stringify(sendata2));
                    });
                }, 500);
            } else if (ms.target === 'message') {
                let sendata = {
                    ip: ms.ip,
                    type: 'message',
                    data: ms.data
                };
                s.clients.forEach(client => {
                    client.send(JSON.stringify(sendata));
                });
            } else if (ms.target === 'gameover') {
                setTimeout(() => {
                    let sendata = {
                        ip: 'サーバー',
                        type: 'message',
                        data: '座標x:' + ms.data[1] + 'で[' + ms.ip + ']がゲームオーバー、スコア' + ms.data[1] + 'MANJU、復活地点' + ms.data[2],
                        server: 1
                    };
                    s.clients.forEach(client => {
                        client.send(JSON.stringify(sendata));
                    });
                }, 500);
            }
            savefile();
        }
    });
    ws.on('close', () => {
        console.log('disconnect');
    });
});

let mainwin;

function readfile() {
    fs.readFile(dire + (ipv4address.split('.').join('_')) + '.json', {
        encoding: 'utf8',
        flag: 'a+'
    }, (error, data) => {
        if (error) {
            console.log(error.message);
            if (error.message.indexOf('ENOENT') !== -1) {
                fs.mkdir(dire, (err) => {
                    if (err) {
                        console.log(err.toString());
                        return;
                    }
                })
            }
        } else {
            if (data != '' && data != null) {
                mgs = JSON.parse(data);
            } else {
                savefile();
            }
        }
        createWindow();
    });
}

function createWindow() {
    mainwin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainwin.setMenu(null)

    mainwin.loadFile('./src/index.html')

    mainwin.on('closed', () => {
        mainwin = null
    })
}

app.on('ready', readfile)

//for mac
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainwin === null) {
        createWindow()
    }
})

ipcMain.handle('invoke-quit', (event, message) => {
    if (message === 'quit') {
        app.quit();
    }
})

function savefile() {
    const filedata = JSON.stringify(mgs);
    const savepoint = ipv4address.split('.').join('_');
    fs.writeFile(dire + savepoint + '.json', filedata, (err) => {
        if (err) throw err;
    });
}

ipcMain.handle('invoke-getip', (event, message) => {
    return ipv4address;
})
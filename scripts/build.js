const {
    build
} = require('electron-builder');

build({
    config: {
        appId: 'app.kumacat.aruku',
        productName: 'aruku',
        files: ['src/**/*', "package-lock.json", "package.json"],
        win: {
            icon: 'assets/icon.ico',
            target: 'nsis'
        },
        mac: {
            icon: 'assets/icon.icns',
            target: {
                target: 'default',
                arch: ['x64', 'arm64'],
            }
        },
        nsis: {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true
        }
    },
});
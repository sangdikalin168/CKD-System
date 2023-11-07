var Service = require('node-windows').Service;

const svc = new Service({
    name: "ckd-server",
    description: "ok",
    script: "D:\\CKD-System\\server\\dist\\index.js"
})

svc.on('install', function () {
    svc.start()
})

svc.install()
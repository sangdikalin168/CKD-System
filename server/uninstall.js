var Service = require('node-windows').Service;

const svc = new Service({
    name: "ckd-server",
    description: "ok",
    script: "D:\\System\\CKD-System\\server\\dist\\index.js"
})

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
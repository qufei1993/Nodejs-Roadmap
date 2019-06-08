const spawn = require('child_process').spawn;

function start(){
    let child = spawn('node', ['./spawn_child.js'], {
        cwd: __dirname,
        detached: true,
        stdio: 'inherit'
    })

    console.log(process.pid, child.pid);

    process.exit(0);
    /**
     * @param { Number } code 子进程退出码
     * @param { String } signal 子进程被终止时的信号
     */
    child.on('close', (code, signal) => {
        console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);

        child.kill();
        child = start();
    });

    /**
     * 出现以下情况触发error事件
     * 1. 进程无法被衍生
     * 2. 进程无法被杀死
     * 3. 向子进程发送信息失败
     */
    child.on('error', (code, signal) => {
        console.log(`收到error事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);

        child.kill();
        child = start();
    });

    return child;
}

start();
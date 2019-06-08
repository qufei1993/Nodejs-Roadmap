const http = require('http');
const [url, port] = ['127.0.0.1', 3000];

const server = http.createServer((req, res) => {
    let a;

    res.end(a.name); // TypeError: Cannot read property 'name' of undefined
});

server.listen(port, url, () => {
    console.log(`server started at http://${url}:${port}`);
});
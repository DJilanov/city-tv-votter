const http = require('http');
const childProcess = require('child_process');
const url = require('url');
const fs = require('fs');

console.log('Server started on port 2400');
http.createServer(function (req, res) {
    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject.votes);
    runScript('./spammer.js', [queryObject.votes], function (err) {
        if (err) throw err;
        console.log('finished running some-script.js');
    });
    res.end();
}).listen(24001);

http.createServer(function (req, res) {
    fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
}).listen(24000);

function runScript(scriptPath, data, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath, data);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}
var http = require('http');
var fs = require('fs');
var url = require('url');

// Server code
http.createServer(function(req, res) {
    var path = '.'+url.parse(req.url).pathname
    if(path === './register.html') {
        fs.readFile(path, function(err, data) {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            } 
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
    if(path === './register.css') {
        fs.readFile('./style/register.css', function(err, data) {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/text'});
                return res.end("404 Not Found");
            } 
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);

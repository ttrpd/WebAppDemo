var http = require('http');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');

// Server code
http.createServer(function(req, res) {
    if(req.method.toLowerCase() === 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log("Username: "+fields['username']+", Email: "+fields['email']);
        });
        // Record new user in the database
        // Send new user a confirmation email
    } else {
        // Serve web page
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
    }
}).listen(8080);

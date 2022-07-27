var http = require('http');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "demo_db_user",
    password: "3mov6@js60ki",
    insecureAuth: true
});

// Initialize database
db.connect(function(err) {
    if(err) throw err;

    // Ensure the database exists
    console.log("Connected!");
    db.query("CREATE DATABASE IF NOT EXISTS demo_db", function(err) {
        if(err) throw err;
        console.log("database has been created");
    });

    // Select the database
    db.query("USE demo_db", function(err){
        if(err) throw err;
    });

    // Ensure that the Users table exists in the database
    db.query(
        "CREATE TABLE IF NOT EXISTS Users (Username varchar(255) NOT NULL UNIQUE, Email varchar(255) NOT NULL)",
        function(err) {
            if(err) throw err;
            console.log("user table has been created");
        }
    );
});

// Server code
http.createServer(function(req, res) {
    if(req.method.toLowerCase() === 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            if (err) {
                console.error(err.message);
                return;
            }
            // Record new user in the database
            var username = db.escape(fields['username']);// Sanitize input
            var email = db.escape(fields['email']);// Sanitize input
            var insert_query = "INSERT INTO Users VALUES ("+username+", "+email+")";
            console.log("adding new user in persistence");
            db.query(insert_query, function(err){
                if(err) {// If the insert fails
                    // Display an error page to the user
                    res.writeHead(200, {'content-type': 'text/html'});
                    fs.readFile('./user_creation_error.html', function(err, data) {
                        if(err) {
                            res.writeHead(404, {'Content-Type': 'text/html'});
                            return res.end("404 Not Found");
                        } 
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data);
                        return res.end();
                    });
                } else {// If the insert succeeds
                    // Display a confirmation page to the user
                    res.writeHead(200, {'content-type': 'text/html'});
                    fs.readFile('./confirmation.html', function(err, data) {
                        if(err) {
                            return res.end("404 Not Found");
                        } 
                        res.write(data);
                        return res.end();
                    });
                }
            });
        });
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

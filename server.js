const http = require('http');
const fs = require('fs');
const url = require('url');
const formidable = require('formidable');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const readlinesync = require('readline-sync');

// Get email credentials for the confirmation email
const source_email = readlinesync.question("Please input the address from which to send the confirmation email:\n");
const source_email_service = readlinesync.question("Please input the email service to be used for the confirmation email (ex: gmail):\n");
const source_email_password = readlinesync.question(
    "Please input the email password:",
    {hideEchoBack: true}
);

// Initialize database
var db = mysql.createConnection({
    host: "localhost",
    user: "demo_db_user",
    password: "3mov6@js60ki",
    insecureAuth: true
});

db.connect(function(err) {
    if(err) throw err;
    
    // Ensure the database exists
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
                    // Send new user a confirmation email
                    var transport = nodemailer.createTransport({
                        service: source_email_service,
                        auth: {
                            user: source_email,
                            pass: source_email_password
                        }
                    });
                    var heading = {
                        from: source_email,
                        to: email,
                        subject: 'Sending Email using Node.js',
                        text: "This email was sent to confirm the creation of \
                        a new user.\nUsername: "+username+"\nEmail: "+email+"\n"
                    };
                    transport.sendMail(heading, function(err){
                        if(err) {
                            console.log("There was an error sending the email:\n"+err);
                        } else {
                            console.log("confirmation email was sent");
                        }
                    });
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

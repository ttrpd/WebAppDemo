# WebAppDemo
This is a simple web application for receiving a new user's username and email, storing them, and confirming its success by sending an email. It uses NodeJS to serve web pages and a MySQL database to store users' credentials.

## Getting Started
If you have Node and MySQL installed, simply clone the repository

```
git clone https://github.com/ttrpd/WebAppDemo.git
```

install the node packages required to run the project

```
npm install
```

_(this should install all the packages listed in pakcage-lock.json although there is a bug with some versions of node that prevents this, so they will have to be installed manually using the command: npm install <package name>)_

and use node to run the server.js script

```
node server.js
```

Then use your browser to navigate to localhost on port 8080

```
http://localhost:8080/register.html
```

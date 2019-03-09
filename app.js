// inculing initial libraries
var Express = require('express'); // Including express module
var App = Express(); // Initilization express in app varaibale
var BodyParser = require('body-parser'); // get body-parser
var Config = require('./config/config.js'); // Include configuration file

var Path = require('path');
var Http = require('http');
var exec = require('child_process').exec;

var port = process.env.PORT || Config.port.myport;

var Server = Http.createServer(App);


App.set('views', Path.join(__dirname, 'views')); //Initilization view folder
App.engine('html', require('ejs').renderFile); //Template engine ejs
App.use(Express.static(Path.join(__dirname, 'public'))); //Setup of public folder to keep images, js and css
App.get('/css', Express.static(__dirname + '/public/css'));

App.use(BodyParser.urlencoded({
  extended: true
}));
App.use(BodyParser.json());

// Routes Initilization.
var Router = require('./routes.js');
Router.routing(App);

Server.listen(port,function(){
  console.log("Assessment project started");
});

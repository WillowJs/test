var path = require('path');
var WillowServer = require('willow-server');
var App = require('./components/app');
var express = require('willow-server/node_modules/express');

new WillowServer({
	componentNamespace: 'component',
	componentDir: path.join(__dirname, './components'),
	port: 3000,
	app: App,
	beforeMiddleware: [
		express.static('assets')
	]
});
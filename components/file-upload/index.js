'use strict';
var Willow = require('willow-component');
module.exports = Willow.createClass({
	render: function() {
		return <button className="file-upload" onClick={this.trigger('choose-file')}>test</button>;
	}
})
.on('choose-file', {
	name: 'start',
	method: 'local',
	dependencies: [],
	run: function(e, resolve, reject) {
		console.log('button click', e);
	}
});
'use strict';
var Willow = require('willow-component');
var App = Willow.createClass({
	render: function() {
		var FileUploadComponent = this.requires.FileUploadComponent;
		return <div>
			<h1>test</h1>
			<FileUploadComponent />
		</div>;
	}
});
App.require('FileUploadComponent', '../file-upload/index.js', 'both');
module.exports = App;
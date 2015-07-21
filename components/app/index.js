'use strict';
var Willow = require('willow-component');
module.exports = Willow.createClass({
	render: function() {
		var FileUploadComponent = this.requires.FileUploadComponent;
		return <div>
			<h1>test</h1>
			<FileUploadComponent />
		</div>;
	}
})
.require('FileUploadComponent', '../file-upload/index.js', 'both');
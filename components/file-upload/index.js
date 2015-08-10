'use strict';
/*global FileDrop*/
var Willow = require('willow-component');
var FileUpload = Willow.createClass({
	componentWillMount: function() {
		this.startTime = null;
	},
	componentDidMount: function() {
		this.uploadZone = new FileDrop(this.refs.uploadButton.getDOMNode(), {});
		this.uploadZone.event('send', this.trigger('choose-file'));
	},
	getInitialState: function() {
		return {
			display: 'block'
		};
	},
	render: function() {
		var style = {
			display: this.state.display
		};
		return (
			<div>
				<div style={style}>this is some text</div>
				<button className="file-upload" ref="uploadButton">test</button>;
			</div>
		);
	}
});
FileUpload.require('filedrop', 'filedrop', 'client')
.require('aws', 'aws-sdk', 'server')
.require('awsConfig', '../../config/aws', 'server')
.on('choose-file', {
	name: 'start',
	method: 'local',
	dependencies: [],
	run: function(e, resolve, reject) {
		if(!e.length) {
			reject('no file was selected');
		}
		else {
			e[0].event('done', function(xhr) {
				resolve(xhr);
			});
			e[0].event('error', function(err) {
				reject(err);
			});
			e[0].sendTo('/component/file-upload/upload-file/process');
		}
	}
})
.on('upload-file', {
	name: 'process',
	method: 'post',
	dependencies: [],
	run: function(e, resolve, reject) {
		console.log(this);
		var s3 = new this.requires.aws.S3({
			accessKeyId: this.requires.awsConfig.accessKeyId,
			secretAccessKey: this.requires.awsConfig.secretAccessKey
		});
		console.log('upload-file:process', e);
	}
});

module.exports = FileUpload;
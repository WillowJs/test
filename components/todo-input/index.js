'use strict';
var Willow = require('willow-component');
module.exports = Willow.createClass({
	getInitialState: function() {
		return {
			error: false
		};
	},
	render: function() {
		var error = false;
		if(this.state.error) {
			error = (<div className="error">{this.state.error}</div>);
		}
		return (
			<form onSubmit={this.trigger('submit')}>
				<input type="text" ref="input" />
				<button type="submit">Add Todo</button>
				{error}
			</form>
		);
	}
})
.require('validate', './validate-todo.js', 'both')
.on('submit', {
	name: 'validate',
	method: 'local',
	dependencies: [],
	run: function(e, resolve, reject) {
		e.nativeEvent.preventDefault();
		var todo = this.refs.input.getDOMNode().value;
		var err = this.requires.validate(todo);
		if(!err) {
			this.setState({error: err});
			return reject(err);
		}

		resolve(todo);
	}
})
.on('submit', {
	name: 'save',
	method: 'post',
	dependencies: ['validate'],
	run: function(e, resolve, reject) {
		var err = this.requires.validate(e.validate);
		if(!err) {
			return reject(err);
		}

		console.log('good data');
		//resolve(todo);
	}
});
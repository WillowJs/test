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
.on('submit', {
	name: 'validate',
	method: 'local',
	dependencies: [],
	run: function(e, resolve, reject) {
		e.nativeEvent.preventDefault();
		var todo = this.refs.input.getDOMNode().value;
		if(!todo) {
			var err = 'You must enter a todo to add.';
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
		console.log(e);
		reject({face: 'book'});
	}
});
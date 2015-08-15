'use strict';
var Willow = require('willow-component');
module.exports = Willow.createClass({
	render: function() {
		var TodoItem = this.requires.TodoItem;
		var TodoInput = this.requires.TodoInput;
		return <div>
			<h1>test</h1>
			<TodoInput />
			<TodoItem item={{name: 'Wash the car'}} />
		</div>;
	}
})
.require('TodoItem', '../todo-item/index.js', 'both')
.require('TodoInput', '../todo-input/index.js', 'both');
var WillowComponent = require('willow-component');
module.exports = WillowComponent.extend({
	render: function() {
		return <h1>test</h1>;
	}
})
.require('_', 'lodash', 'client');
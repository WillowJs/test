# immediate
- Figure out error...
	Warning: React.createElement: type should not be null or undefined. It should be a string (for DOM elements) or a ReactClass (for composite components).

	Warning: Only functions or strings can be mounted as React components.
- lodash was way too large, so in the process of only grabbing the necessary functionality
- get test file upload component working
	- save file to aws

# short term
- come up with demo screencast
- server code is not being removed from client bundle.js
- add ability to specify component specific configurations (mostly for the server)
	- for example, where should my file-upload button store files, aws credentials, etc
- update willow-server to just be express middleware... no need to introduce a new paradigm


# mid term
- clean up the way that components directories are structured
- only triggering events in certain contexts (from nodes)

# long term
- figure out how to get requires working in a way that doesn't duplicate libraries when using browserify
const uuid = require('node-uuid');

module.exports = () => {
	return {
		_id: uuid.v4(),
		something: 'anything'
	}
}
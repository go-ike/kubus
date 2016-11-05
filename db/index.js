function db(config) {
	let nano = require('nano')(config.url);
	return nano.use(config.name);
}

module.exports = db;

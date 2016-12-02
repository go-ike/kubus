const promisify = require("es6-promisify");
let instance;

module.exports = function(config) {
	if(!instance && !config) return false;
	if(instance && !config) return instance;

	let nano = require('nano')(config.url);
	nano.db.create(config.name);

	instance = nano.use(config.name);
	instance = promisifyNano(instance);

	return instance;
}

function promisifyNano(object) {
	const props = ['insert', 'destroy', 'get', 'head', 'copy',
	'bulk', 'list', 'fetch', 'fetchRevs', 'multipart.insert',
	'multipart.get', 'attachment.insert', 'attachment.get', 
	'attachment.destroy', 'view', 'viewWithList', 'show', 
	'atomic', 'search'];

	for(let prop of props) {
		if(prop.indexOf('.') > -1) {
			let thisProps = prop.split('.');
			object[thisProps[0]][thisProps[1]] = promisify(object[thisProps[0]][thisProps[1]], object);
		} else {
			object[prop] = promisify(object[prop], object);
		}
	}

	return object;
}
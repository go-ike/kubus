
module.exports = {
	setup(options) {
		if(!options) 
			throw new Error('Kubus setup\'s options can\'t be blank')
		else if (!options.url || typeof options.url !== 'string')
			throw new TypeError(`${options.url} is not a valid url`)
		else if (!options.name || typeof options.name !== 'string')
			throw new TypeError(`${options.name} is not a valid name`)

		require('./db')(options);
		require('./view/createAllViews')(options);
	}
};

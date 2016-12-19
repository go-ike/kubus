const fs   = require('fs')
const glob = require('glob')
const Db   = require('../db')()

module.exports = function(config) {
	let viewsFolder = config.viewsFolder || 'dbviews'
	let viewsSuffix = config.viewsSuffix || '.view.js'

	glob(`${viewsFolder}/**/*${viewsSuffix}`, (err, files) => {
		for(file of files) {
			let designDoc = require(file).designDocument()
			handleDesignDoc(designDoc)
		}
	})
}

function handleDesignDoc(designDocument) {
	Db.get(designDocument._id)
	.then(doc => {
		return Db.destroy(doc._id, doc._rev)
	})
	.then(deleted => {
		createDesignDoc(designDocument)
	})
	.catch(err => {
		if (err.statusCode = 404) createDesignDoc(designDocument)
		else throw new Error(`Unable to create ${designDocument._id} \n Error: ${err.description}`)
	})
}

function createDesignDoc(designDocument) {
	Db.insert(designDocument)
	.catch(err => {
		throw new Error (`Unable to create ${designDocument._id} \n Error: ${err.description}`)
	})
}
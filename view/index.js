const Db = require('../db')()
const inflect = require('i')

const _docName = Symbol()
const _docId   = Symbol()
const _views   = Symbol()
const _lists   = Symbol()
const _shows   = Symbol()

class KubusView {
	constructor() {
		this[_docName] = this.constructor.name
		this[_docId]   = `_design/${this[_docName]}`
		this[_views]   = {}
		this[_lists]   = {}
		this[_shows]   = {}

		// Register the main views by default
		this.registerView('main', this.map, this.reduce)
		this.registerList('main', this.list)
		this.registerShow('main', this.show)
	}

	/** Placeholder functions so it doesnt yield undefined on the
	    main registers, should the class not define them */
	map(doc) {}
	reduce(key, values, rereduce) {}
	show(head, req) {}
	list(doc, req) {}

	/**
	 * Returns the design document to be inserted
	 * in the database
	 * @return {[type]} [description]
	 */
	designDocument() {
		let doc = {}
		doc._id = this[_docId]
		doc.language = 'javascript'

		doc.views = this[_views]
		doc.lists = this[_lists]
		doc.shows = this[_shows]

		return doc
	}

	/**
	 * Get document by key
	 * @param  {String}  key      The view exact key
	 * @param  {String}  viewName Name of the view to query
	 * @param  {Object}  options  CouchDB params object
	 * @return {Promise}        
	 */
	getKey(key, viewName = 'main', options = {}) {
		options = Object.assign({key: key}, options)
		return Db.view(this[_docId], viewName, options)
	}

	/**
	 * Get multiple documents by key
	 * @param  {Array}   keys     Array of view keys to return
	 * @param  {String}  viewName Name of the view to query
	 * @param  {Object}  options  CouchDB params object
	 * @return {Promise}
	 */
	getKeys(keys, viewName = 'main', options = {}) {
		options = Object.assign({keys: keys}, options)
		return Db.view(this[_docId], viewName, options)
	}

	/**
	 * Query a view using start and end keys
	 * @param  {String}  startkey The startkey
	 * @param  {String}  endkey   The endkey
	 * @param  {String}  viewName Name of the view to query
	 * @param  {Object}  options  CouchDB params object
	 * @return {Promise}
	 */
	query(startkey, endkey, viewName = 'main', options = {}) {
		options = Object.assign({starkey: key, endkey: endkey}, options)
		return Db.view(this[_docId], viewName, options)
	}

	/**
	 * Raw query to the view, exposing the whole params
	 * object
	 * @param  {Object} options CouchDB params object
	 * @return {Proise}
	 */
	raw(options) {
		return Db.view(this[_docId], 'main', options);
	}

	/**
	 * Gets a list from a specific view
	 * @param  {String}  viewName The name of the view
	 * @param  {String}  listName The name of the list
	 * @param  {Object}  options  The CouchDB params object
	 * @return {Promise}
	 */
	getList(viewName = 'main', listName = 'main', options) {
		return Db.viewWithList(this[_docId], 'main', 'main', options)
	}

	/**
	 * Show a specific document through a show function
	 * @param  {String}  docId    The _id of the target document
	 * @param  {String}  showName The name of the show function
	 * @param  {Object}  options  CouchDB params object
	 * @return {Promise}          
	 */
	getShow(docId, showName = 'main', options) {
		return Db.show(this[_docId], showName, docId, options)
	}

	/**
	 * Registers a view to the design document
	 * @param  {String}   name   The view name
	 * @param  {Function} map    The map function expression
	 * @param  {Function} reduce The reduce function expressions
	 * @return {void}
	 */
	registerView(name, map, reduce) {
		if(typeof name !== 'string') 
			throw new TypeError('name must be a string')
		if(typeof map !== 'function') 
			throw new TypeError('map must be a function')
		if(typeof reduce !== 'function' && reduce !== undefined)
			throw new TypeError('reduce must be a fuction')

		this[_views][name] = { map: this._prepareFunctionString(map) }

		if(reduce !== undefined)
			this[_views][name][reduce] = this._prepareFunctionString(reduce)			
	}

	/**
	 * Registers a list to the design document
	 * @param  {String}   name The list name
	 * @param  {Function} list The list function expressions
	 * @return {void}
	 */
	registerList(name, list) {
		if(typeof name !== 'string') 
			throw new TypeError('name must be a string')
		if(typeof list !== 'function') 
			throw new TypeError('list must be a function')

		this[_lists][name] = this._prepareFunctionString(list)
	}

	/**
	 * Registers a show to the design document
	 * @param  {String}   name The show name
	 * @param  {Function} show The show function expression
	 * @return {void}
	 */
	registerShow(name, show) {
		if(typeof name !== 'string') 
			throw new TypeError('name must be a string')
		if(typeof show !== 'function') 
			throw new TypeError('show must be a function')

		this[_shows][name] = this._prepareFunctionString(show)
	}


	/* private */

	/**
	 * Transforms a function expression into a couch-compatible
	 * design document function
	 * @param  {Function} functionExpression The function expression
	 * @return {String}
	 */
	_prepareFunctionString(functionExpression) {
		let fn = functionExpression.toString()
		let functionNameRegex = /^[a-z]+()/i

		fn = fn.replace(functionNameRegex, 'function');
		return fn;
	}
}


module.exports = KubusView

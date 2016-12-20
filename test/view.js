const assert = require('assert')

describe('KubusView Instance', () => {
	describe('#constructor()', () => {
		it('should have the design doc _id as class name if not overwritten')
		it('should be able to ovewrite the design doc _id')
		it('should register the main view with map and reduce')
		it('should register the main list function')
		it('should register the main show function')
	})

	describe('#designDocument()', () => {
		it('should return the design document to be inserted')
		it('should be a valid design document')
	})

	describe('#getKey()', () => {
		it('should query a view by key')
		it('should select main view if none specified')
		it('should be able to select any registered view')
		it('should throw when view does not exist')
		it('should translate options object to couch query options')
	})

	describe('#getKeys()', () => {
		it('should query a view with an array of keys')
		it('should throw if not provided with an array')
		it('should select main view if none specified')
		it('should be able to select any registered view')
		it('should throw when view does not exist')
		it('should translate options object to couch query options')
	})

	describe('#query()', () => {
		it('should query a view by startkey and endkey')
		it('should throw if startkey or endkey are missing')
		it('should select main view if none specified')
		it('should be able to select any registered view')
		it('should throw when view does not exist')
		it('should translate options object to couch query options')	
	})

	describe('#raw()', () => {
		it('should send a raw couchdb query')
	})

	describe('#getList()', () => {
		it('should call a specific list function on a specific view')
		it('should select main view and main list if none are specified')
		it('should throw if view doesn\'t exist')
		it('should throw if list doesn\'t exist')
	})
	
	describe('#getShow()', () => {
		it('should call a specific show function on a specific document')
		it('show select main show function if none specified')
		it('should throw if no document specified')
		it('should throw if document doesn\'t exist')
		it('should throw if show function doesn\'t exist')
	})

	describe('#registerView()', () => {
		it('should register a view with map function')
		it('should register a view with map and reduce function')
		it('should not register a view if there\'s no map function')
		it('should not register a view if name is not a string')
		it('should not register a view if map is not a function')
		it('should not register a view if reduce is present and not a function')
		it('should not remove previous views')
	})

	describe('#registerList()', () => {
		it('should register a list function')
		it('should not register a list function if the name is not a string')
		it('should not register a list function if list is not a function')
		it('should not remove previous list functions')
	})

	describe('#registerShow()', () => {
		it('should register a show function')
		it('should not register a show function if the name is not a string')
		it('should not register a show function if show is not a function')
		it('should not remove previous show functions')
	})

	describe('#_prepareFunctionString()', () => {
		it('should transform any function into a couch-compliant one')
		it('should not transform something that\'s not a function')
	})

})

describe('Create all views', () => {
	describe('#function()', () => {
		it('should update all views from a specific folder and file sulfix')
		it('should be possible to change the views folder')
		it('should be possible to change the views file sulfix')
	})

	describe('#handleDesignDoc', () => {
		it('should destroy an existing design doc')
	})

	describe('#createDesignDoc', () => {
		it('should create a new design doc from its class')
		it('should not create a view that\'s not a KubusView class')
	})
})
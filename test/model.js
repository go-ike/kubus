const assert = require('assert')

describe('KubusModel', () => {
	describe('#get()', () => {
		it('should return an instance from a document id')
		it('should throw if the type doesn\'t match')
		it('should throw if the document doesn\'t exists')
	})
})

describe('KubusModel Instance', function() {
	describe('#constructor()', () => {
		it('should be of classname type if not overwritten')
		it('should be able to overwrite type')
		it('should validate _id\'s required presence and _rev\' possible presence')
	})

	describe('#setValidation()', () => {
		it('should set new validation rules')
		it('should not lose previous validation rules')
		it('should overwrite existent validation rules')
	})

	describe('#save()', () => {
		it('should prevent invalid document from saving')
		it('should save valid documents')
		it('should add id to documents that don\'t have it')
		it('should not overwrite id on documents that have it')
	})

	describe('#delete()', () => {
		it('should not delete a document that has not been saved yet')
		it('should not delete a document of a different type')
		it('should delete an existing document')
	})

	describe('#clone()', () => {
		it('should return a new instance of the source object')
	})

	describe('#attach()', () => {
		it('should attach a file to a document')
		it('should not attach somethings that\'s not a file')
	})

	describe('#getAttachment()', () => {
		it('should get a named attachment from a document')
		it('should throw when the attachment doesn\'t exist')
	})

	describe('#validate()', () => {
		it('should be true for a valid object')
		it('should be false for a not valid object')
	})

	describe('#beforeCreate()', () => {
		it('should modify a document before creating it')
		it('should perform an action before creating the document')
		it('should not be triggered if the document already exists')
	})

	describe('#afterCreate()', () => {
		it('should perform an action after creating the document')
		it('should not be triggered if the document already exists')
	})

	describe('#beforeUpdate()', () => {
		it('should modify a document before updating it')
		it('should perform an action before creating the document')
		it('should not be triggered if the document does not exist yet')
	})

	describe('#afterUpdate()', () => {
		it('should perform an action after creating the document')
		it('should not be triggered if the document does not exist yet')
	})

	describe('#beforeSave()', () => {
		it('should modify a document before saving the document')
		it('should perform an action before saving the document')
	})

	describe('#afterSave()', () => {
		it('should perform an action after the document has been saved')
	})

	describe('#beforeDelete()', () => {
		it('should perform an action before deleting the document')
	})

	describe('#afterDelete()', () => {
		it('should perform an action after the document has been deleted')
	})
})
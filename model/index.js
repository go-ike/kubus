const validate = require('validate.js');
const uuid     = require('node-uuid');
const _        = require('lodash');
const Db       = require('../db')();

const _validation = Symbol();

class KubusModel {
	constructor(object) {
		this.type = this.constructor.name;
		this[_validation] = {};

		this.setValidation({
			_id: { presence: true },
			_rev: {}
		});
	}

	/**
	 * Sets the model validation object
	 * @param {Object} validationObject Validate.js compliant validation
	 *                                  object
	 */
	setValidation(validationObject) {
		this[_validation] = Object.assign(this[_validation], validationObject);
	}

	/**
	 * Saves the document. If it doens't exist, 
	 * creates an id to save it
	 * @return {Promise}
	 */
	save() {
	return new Promise((resolve, reject) => {
		if(!this._id) this._id = uuid.v4();
		let before = _.cloneDeep(this);

		this.validate()
		.then(isValid => Db.insert(this))
		.then(inserted => {
			resolve(inserted);
			if(before._rev) self.onUpdate(before, this);
			else self.onCreate(before, this);
			onCreateOrUpdate(before, this);
		})
		.catch(error =>{ reject(error) });
	});
	}

	/**
	 * Deletes the document
	 * @return {Promise}
	 */
	delete() {
	return new Promise((resolve, reject) => {
		if (!this._rev || !this._id) {
			reject(new Error('Document hasn\'t been saved yet'));
			return;
		}

		Db.destroy(this._id, this._rev)
		.then(deleted => {
			resolve(deleted);
			this.onDelete(this);
		})
		.catch(error => reject(error));
	});
	}

	/**
	 * Clones the document into a new one
	 * @return {Promise|KubusModel}
	 */
	clone() {
		return new this.constructor(this);
	}

	/**
	 * Attaches a file to the document
	 * @param  {String} fileName    The file name
	 * @param  {String} contentType The content mime type
	 * @param  {Data}   data        The attachment data
	 * @return {Promise}
	 */
	attach(fileName, contentType, data) {
	return new Promise((resolve, reject) => {
		Db.attachment.insert(this._id, fileName, data, contentType, this._rev)
		.then(success => resolve(success))
		.catch(error => reject(error));
	});
	}

	/**
	 * Gets an attachment from the document
	 * @param  {String} fileName The attachment name
	 * @return {Promise}
	 */
	getAttachment(fileName) {
	return new Promise((resolve, reject) => {
		db.attachment.get(this._id, fileName)
		.then(success => resolve(succes))
		.catch(error => reject(error));
	});
	}

	/**
	 * Gets an attachment from the document
	 * @param  {String} fileName The attachment name
	 * @return {Promise}
	 */
	validate() {
	return new Promise((resolve, reject) => {		
		validate.async(this, this[_validation])
		.then(success => { resolve(true);})
		.catch(error => reject(error));
	});
	}

	/**
	 * Lifecycle hooks, made available for class instances
	 * to modify the object at any point.
	 * @param  {Object} before The object before saving
	 * @param  {Object} after  The object after saving
	 */
	onCreateOrUpdate(before, after) {}
	onCreate(before, after) {}
	onUpdate(before, after) {}
	onDelete(before) {}


	/* static */


	/**
	 * Gets a document
	 * @param  {String} documentId The document ID
	 * @return {Promise|KubusModel} Returns an instance of the model
	 */
	static get(id) {
	return new Promise((resolve, reject) => {
		Db.get(id)
		.then(body => {
			if(body.type != this.type) 
				reject(new Error('Not a' + this.type + ' document'));
			else
				resolve(new this(body));
		})
		.catch(error => reject(error));
	});
	}
}

module.exports = KubusModel;

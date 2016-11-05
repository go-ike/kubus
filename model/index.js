const validate  = require('validate.js');
const db        = require('../db');
const camelcase = require('camelcase');
const lodash    = require('lodash');
const uuid      = require('node-uuid');

class KubusModel {
	constructor() {}

	/**
	 * Saves the document. If it doens't exist, 
	 * creates an id to save it
	 * @return {Promise}
	 */
	save() {
		return new Promise((resolve, reject) => {
			let before = _.cloneDeep(this);
			if(!this._id) this._id = uuid.v4();

			db.insert(self, (error, body) => {
				if(err) reject(err);
				else {
					resolve(body);
					if(before._rev) self.onCreate(before, this);
					else self.onUpdate(before, this);
					onCreateOrUpdate(before, this);
				}
			})
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

			db.destroy(this._id, this._rev, (err, body) => {
				if (err) reject(err);
				else {
					resolve(body);
					onDelete(this);
				}	
			});
		});
	}

	/**
	 * Clones the document into a new one
	 * @return {Promise}
	 */
	clone() {
		return new Promise((resolve, reject) => {
			db.copy(this._id, 'newid', (err, _, headers) => {
				if (!err) reject(err);
				else resolve(headers);
			});
		});
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
			db.attachment.insert(this._id, fileName, data, 
				contentType, this._rev, (err, body) => {
				if (err) reject(err);
				else resolve(body);
			});
		});
	}

	/**
	 * Gets an attachment from the document
	 * @param  {String} fileName The attachment name
	 * @return {Promise}
	 */
	getAttachment(fileName) {
		return new Promise((resolve, reject) => {
			db.attachment.get(this._id, fileName, (err, body) => {
				if (err) reject(err);
				else resolve(body);
			});
		});
	}

	/**
	 * Hook triggered when the document is 
	 * created or updated
	 * @param  {Object} before The object before saving
	 * @param  {Object} after  The object after saving
	 */
	onCreateOrUpdate(before, after) {}

	/**
	 * Hook trigerred when the new document is saved
	 * @param  {Object} before The object before saving
	 * @param  {Object} after  The object after saving
	 */
	onCreate(before, after) {}

	/**
	 * Hook triggered when the existing document is updated
	 * @param  {Object} before The object before saving
	 * @param  {Object} after  The object after saving
	 */
	onUpdate(before, after) {}

	/**
	 * Hook trigerred when the document is deleted
	 * @param  {Object} after  The object after saving
	 */
	onDelete(after) {}

	// static
	
	/**
	 * Gets a document
	 * @param  {String} documentId The document ID
	 */
	static get(documentId) {
		return new Promise((resolve, reject) => {
			db.get(documetnId, (err, body) => {
				if (err)
					reject(err);
				else if(body.type != self._type)
					reject(new Error('Not same type as class'));
				else
					resolve(body);
			});
		});
	}
}

module.exports = KubusModel;

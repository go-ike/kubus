const chai   = require('chai')
const assert = chai.assert
const kubus  = require('../index.js')
const uuid   = require('node-uuid')
const fs     = require('fs')

describe('Db', function() {
	this.timeout(8000)
	this.slow(2000)

	before('setup database', () => {
		kubus.setup({
			url: process.env.COUCH_DB,
			name: 'teste',
			viewsFolder: `${__dirname}/support/dbviews`,
			viewsSuffix: '.view.js'
		});
	})

	describe('#require', () => {
		it('should return the same instance for every require', done => {
			let db1 = require('../db')()
			let db2 = require('../db')()
			assert.equal(db1, db2)
			done()
		})
	})

	describe('#Db', () => {
		it('should insert a document', done => {
			let Db = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()

			Db.insert(sampleDoc)
			.then(result => {
				assert.equal(result.ok, true)
				done()
			})
			.catch(err => done(err))
		})

		it('should destroy a document', done => {
			let Db = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()

			Db.insert(sampleDoc)
			.then(result => Db.destroy(result.id, result.rev))
			.then(destroyed => done())
			.catch(err => done(err))
		})

		it('should get a document', done => {
			let Db = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()

			Db.insert(sampleDoc)
			.then(result => Db.get(sampleDoc._id))
			.then(doc => {
				assert.equal(doc.something, 'anything')
				done()
			})
			.catch(err => done(err))
		})

		it('should copy a document', done => {
			let Db = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()
			let idToCopy = uuid.v4()

			Db.insert(sampleDoc)
			.then(result => Db.get(sampleDoc._id))
			.then(doc => Db.copy(doc._id, idToCopy))
			.then(copy => Db.get(idToCopy))
			.then(copiedDoc => {
				assert.equal(copiedDoc.something, 'anything')
				done()
			})
			.catch(err => done(err))
		})

		it('should insert documents in bulk', done => {
			let Db = require('../db')()
			let sampleDoc1 = require('./support/db/test-doc.js')()
			let sampleDoc2 = require('./support/db/test-doc.js')()
			let bulkDocs = { docs: [sampleDoc1, sampleDoc2] }

			Db.bulk(bulkDocs)
			.then(bulk => Promise.all([Db.get(bulk[0].id), Db.get(bulk[1].id)]))
			.then(docs => {
				for(doc of docs) { assert.equal(doc.something, 'anything') }
				done()
			})
			.catch(err => done(err))
		})
		
		
		it('should fetch documents in bulk', done => {
			let Db = require('../db')()
			let sampleDoc1 = require('./support/db/test-doc.js')()
			let sampleDoc2 = require('./support/db/test-doc.js')()
			let bulkDocs = { docs: [sampleDoc1, sampleDoc2] }

			Db.bulk(bulkDocs)
			.then(bulk => Db.fetch({ keys: [bulk[0].id, bulk[1].id] }))
			.then(docs => {
				for(doc of docs.rows) { assert.equal(doc.doc.something, 'anything') }
				done()
			})
			.catch(err => done(err))
		})

		it('should insert a multipart document', done => {
			let Db        = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()
			let fileData  = fs.readFileSync(__dirname + '/support/images/cat.gif')
			let file      = { name: 'cat.gif', data: fileData, content_type: 'image/gif' }

			Db.multipart.insert(sampleDoc, [file], sampleDoc._id)
			.then(res => Db.get(res.id))
			.then(doc => {
				let attachments = Object.keys(doc._attachments)
				assert.include(attachments, 'cat.gif', 'cat.gif is attached to document')
				done()
			})
			.catch(err => done(err))
		})
		it('should insert an attachment', done => {
			let Db        = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()
			let fileData  = fs.readFileSync(__dirname + '/support/images/cat.gif')

			Db.insert(sampleDoc)
			.then(res => Db.get(res.id))
			.then(doc => Db.attachment.insert(doc._id, 'cat.gif', fileData, 'image/gif', {rev: doc._rev}))
			.then(res => Db.get(res.id))
			.then(doc => {
				let attachments = Object.keys(doc._attachments)
				assert.include(attachments, 'cat.gif', 'cat.gif is attached to document')
				done()
			})
			.catch(err => done(err))
		})

		it('should get an attachment', done => {
			let Db        = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()
			let fileData  = fs.readFileSync(__dirname + '/support/images/cat.gif')
			let file      = { name: 'cat.gif', data: fileData, content_type: 'image/gif' }

			Db.multipart.insert(sampleDoc, [file], sampleDoc._id)
			.then(res => Db.get(res.id))
			.then(doc => Db.attachment.get(doc._id, 'cat.gif'))
			.then(attachment => {
				assert.equal(attachment.compare(fileData), 0)
				done()
			})
			.catch(err => done(err))
		})
		
		it('should destroy an attachment', done => {
			let Db        = require('../db')()
			let sampleDoc = require('./support/db/test-doc.js')()
			let fileData  = fs.readFileSync(__dirname + '/support/images/cat.gif')
			let file      = { name: 'cat.gif', data: fileData, content_type: 'image/gif' }

			Db.multipart.insert(sampleDoc, [file], sampleDoc._id)
			.then(res => Db.get(res.id))
			.then(doc => {
				let attachments = Object.keys(doc._attachments)
				assert.include(attachments, 'cat.gif', 'cat.gif is attached to document')
				return Db.attachment.destroy(doc._id, 'cat.gif', { rev: doc._rev})
			})
			.then(res => Db.get(res.id))
			.then(doc => {
				assert.equal(doc._attachments, undefined)
				done()
			})
			.catch(err => done(err))
		})
		
		it('should get a view\'s result')
		it('should get a view\'s result with its list function')
		it('should get a document with its show function')
		it('should call the update function on specific doc')
		it('should get the cloudant search results')
	})
});
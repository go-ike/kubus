module.exports = {
	"_id": "_design/test",
	"language": "javascript",
	"views": {
		"main": {
			"map": "function (doc) {if (doc.type == 'test'){emit(doc._id,null);}}"
		}
	},
	"lists": {
		"main": "function(head, req) {provides('json', function() {var results = []; while(row = getRow()) { results.push([row.key, row.value]);} return JSON.stringify(results); }); }"
	},
	"shows": {
		"main": "function(doc, req) { return '<h1>' + doc.something + '</h1>'; }"
	},
	"indexes": {
		"main": {
		  "analyzer": "standard",
		  "index": "function (doc) { index('something', doc.something); }"
		}
	}
}
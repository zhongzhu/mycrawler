var async = require('async');
var fs = require('fs');
var read = require('./read.js');

var mainUrl = 'http://www.bioon.com.cn/corporation/index.asp'

// var myCompanyCategoryList;
// var myCompanyList;

async.waterfall([
	// get the companyCategoryList:
	function (callback) {
		console.time('grab company URLs');
		read.getCompanyCategoryList(mainUrl, function(err, companyCategoryList) {
			callback(err, companyCategoryList);
		});
	},

	// get the companyList
	function(companyCategoryList, callback) {
		read.getCompanyList(companyCategoryList, function(err, companyList) {
			callback(err, companyList)
		});
	}],

	// optional callback
	function(err, companyList) {
		console.timeEnd('grab company URLs');
		if (err) {
			console.log('finally: ' + err);
		} else {
			fs.writeFile("./companyList.json", JSON.stringify(companyList), function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log(companyList.length + " companies saved to companyList.js.");
				}
			}); 	
		}    
	}

);
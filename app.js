var async = require('async');
var fs = require('fs');
var read = require('./read.js');

var mainUrl = 'http://www.bioon.com.cn/corporation/index.asp'

// var myCompanyCategoryList;
// var myCompanyList;

async.waterfall([
	// get the companyCategoryList:
	function (callback) {
		read.getCompanyCategoryList(mainUrl, function(err, companyCategoryList) {
			// companyCategoryList = companyCategoryList.slice(0, 1);
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
		fs.writeFile("./companyList.js", JSON.stringify(companyList), function(err) {
		  if (err) {
		        console.log(err);
		  } else {
		    console.log(companyList.length + " companies saved to companyList.js.");
		  }
		}); 	    
	}

);
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); // decode GB2312
var url = require('url');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');

var getOneCompanyInfo = function(company, callback) {
	request({
	    encoding: null,
	    url: company.url
	}, function(err, response, body) {
		if (err) return callback(err);		

		var bodyConverted = iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(bodyConverted);

		var result = [];
		result.push({
			name: company.company,
			url: company.url,
			intro: $('.about p').text()
		});

		callback(null, result);	
	});	
}

async.waterfall([
    function(callback){
		fs.readFile('./companyList.json', function (err, data) {
			if (err) return callback(err);

			var companyList = JSON.parse(data);
			companyList = companyList.slice(0, 5);// test with 5 companies
			callback(null, companyList);
		});
    },

    function(companyList, callback){
		async.mapLimit(companyList, 5, getOneCompanyInfo, function(err, companyInfoList) {
		    callback(null, _.flatten(companyInfoList));
		});	        
    }
],
// the final function
function(err, result){
    if (err) {
    	console.error('Final error: ' + err);
    } else {
    	console.log(result);
    }
});
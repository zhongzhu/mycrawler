var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); // decode GB2312
var url = require('url');


console.log('读取按行业划分公司库');
var baseUrl = 'http://www.bioon.com.cn/corporation/';

request({
    encoding: null,
    url: 'http://www.bioon.com.cn/corporation/index.asp'
}, function(err, response, body) {
	if (err) {
		return console.error(err);
	}

	var bodyConverted = iconv.decode(body, 'gb2312').toString();
	// console.log(a);

	var $ = cheerio.load(bodyConverted);
	var companyCategories = [];
	$('.content .company_category a').each(function() {
		var $me = $(this);
		companyCategories.push({
			company_category: $me.text().trim(),
			url: url.resolve(baseUrl, $me.attr('href'))
		});
	});

	console.log(companyCategories);	
});
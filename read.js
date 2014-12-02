var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); // decode GB2312
var url = require('url');
var async = require('async');
var _ = require('underscore');

var baseUrl = 'http://www.bioon.com.cn/corporation/';


/**
 * 获取公司分类列表
 *
 * @param {String} myUrl
 * @param {Function} callback
 */
exports.getCompanyCategoryList = function (myUrl, callback) { 
	//
	// [ { category: '生物类:仪器生产类',
	//     url: 'http://www.bioon.com.cn/corporation/list.asp?sortid=1&typeid=1' },
	//   { category: '生物类:仪器销售类',
	//     url: 'http://www.bioon.com.cn/corporation/list.asp?sortid=1&typeid=2' },	
	// ....
	// ]	
	request({
	    encoding: null,
	    url: myUrl
	}, function(err, response, body) {
		if (err) return callback(err);		

		var bodyConverted = iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(bodyConverted);

		var result = [];
		$('.content .company_category').each(function(index, element) {
			var $me = $(this),
				company_category = 	$me.text().trim();

			$me.next('.company_list').find('li .tt a').each(function() {
				result.push({
					category: company_category + ':' + $(this).text().trim(),
					url: url.resolve(baseUrl, $(this).attr('href'))
				});
			});
		});		

		callback(null, result);	
	});
}

/**
* 获取某一个公司分类下的，当前页面所有公司
*
*/
var getCompanyListForOneCategory = function(companyCategory, callback) {
	request(companyCategory.url, function(err, response, body) {
		if (err) return callback(err);

		// get total page#
		var $ = cheerio.load(body);		
		var nextUrl = $('.seasonnav ul li a').last().attr('href');
		var pageNumber = nextUrl.match(/page=(\d+)/)[1];

		// page URL for each page
		// companyCategory.url: http://www.bioon.com.cn/corporation/list.asp?sortid=1&typeid=35
		// companyCategoryURLs: http://www.bioon.com.cn/corporation/list.asp?sortid=1&typeid=35&page=2
		var companyCategoryURLs = [];
		for (var i = 1; i <= pageNumber; i++) {
			companyCategoryURLs.push(companyCategory.url + '&page=' + i);
		}

		async.mapLimit(companyCategoryURLs, 10, getCompanyListFromOnePage, function(err, companyList){
		    callback(null, _.flatten(companyList));
		});
	});	
}

/**
* 获取某一个公司分类下的，当前页面所有公司
*
*/
var getCompanyListFromOnePage = function(companyCategoryURL, callback) {
	console.log('* Checking: ' + companyCategoryURL);

	request({
	    encoding: null,
	    url: companyCategoryURL
	}, function(err, response, body) {
		if (err) return callback(err);

		var bodyConverted = iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(bodyConverted);

		var companyList = [];
		$('.feature span a').each(function() {
			var $me = $(this);
			companyList.push({
				company: $me.text().trim(),
				url: $me.attr('href')
			});
		});

		callback(null, companyList);	
	});	
}

/**
 * 获取某一个公司分类下的所有公司
 *
 * @param {String} url
 * @param {Function} callback
 */
exports.getCompanyList = function(companyCategoryList, callback) {
    // { company: '南京同兴高速分析仪器有限公司',
    //   url: 'http://www.bioon.com.cn/show/index.asp?id=260069' },
    // { company: '海门市优耐特实验器材发展有限公司',
    //   url: 'http://www.bioon.com.cn/show/index.asp?id=177029' },		
	async.mapLimit(companyCategoryList, 5, getCompanyListForOneCategory, function(err, companyList) {
	    callback(null, _.flatten(companyList));
	});	
}


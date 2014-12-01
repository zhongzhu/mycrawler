var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite'); // decode GB2312
var url = require('url');


var baseUrl = 'http://www.bioon.com.cn/corporation/';


/**
 * 获取公司分类列表
 *
 * @param {String} myUrl
 * @param {Function} callback
 */
exports.getCompanyCategoryList = function (myUrl, callback) { 
	request({
	    encoding: null,
	    url: myUrl
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}

		var bodyConverted = iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(bodyConverted);

		var result = [];

		$('.content .company_category').each(function(index, element) {
			var $me = $(this),
				company_category = 	$me.text().trim();

			var subCategoryList = [];
			$me.next('.company_list').find('li .tt a').each(function() {
				subCategoryList.push({
					sub_category: $(this).text().trim(),
					url: url.resolve(baseUrl, $(this).attr('href'))
				});
			});

			result[company_category] = subCategoryList;
		});		

		callback(null, result);	
	});
}

/**
 * 获取某一个公司分类下的所有公司
 *
 * @param {String} categoryUrl
 * @param {Function} callback
 */
exports.getCompanyList = function(categoryUrl, callback) {
	request({
	    encoding: null,
	    url: categoryUrl
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}

		var bodyConverted = iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(bodyConverted);

		// get total page#
		var nextUrl = $('.seasonnav ul li a').last().attr('href');
		var pageNumber = nextUrl.match(/page=(\d+)/)[1];
		console.log(nextUrl + ' ' + pageNumber);

		var companyList = [];
		$('.feature span a').each(function() {
			var $me = $(this);
			companyList.push({
				company_name: $me.text().trim(),
				url: $me.attr('href')
			});
		});

		// check if we have next page


		callback(null, companyList);	
	});
}
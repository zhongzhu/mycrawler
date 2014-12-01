var read = require('./read.js');


var baseUrl = 'http://www.bioon.com.cn/corporation/';
var mainUrl = 'http://www.bioon.com.cn/corporation/index.asp'

var myCompanyCategoryList;
var myCompanyList;

read.getCompanyCategoryList(mainUrl, function(err, list) {
	myCompanyCategoryList = list;
	console.log(myCompanyCategoryList);
});

// read.getCompanyList('仪器生产类', 'http://www.bioon.com.cn/corporation/list.asp?sortid=1&typeid=1', function(err, list) {
// 	myCompanyList = list;
// 	console.log(myCompanyList);
// });
var CronJob = require('cron').CronJob;
var request = require('request');
var fs = require('fs');

var job = new CronJob({
	cronTime: '00 00 05 * * 0-6',
	onTick: function(){
		console.log("CRONNN")
		var date = new Date();
		var stringDate = String(date.getDate())+"-"+String(date.getMonth()+1)+"-"+String(date.getFullYear())
		request('http://localhost:3000/search/all').pipe(fs.createWriteStream('./cron/backup/'+stringDate+'.txt'))
	},
	start: false,
	timeZone:'America/New_York'
});

module.exports = job 
const bunyan = require('bunyan');
const path = require('path');
const fs = require('fs');
const logs = './logs';

if (!fs.existsSync(logs)) {
	fs.mkdirSync(logs);
}

const logger = bunyan.createLogger({
	name: 'jrkeystone',
	streams: [
		{
			// stream: process.stdout
			type: 'rotating-file',
			level: 'info',
			path: path.join(__dirname, '../logs', 'info.log'),
			period: '1d',
			count: 3
		},
		{
			type: 'rotating-file',
			level: 'debug',
			path: path.join(__dirname, '../logs', 'server.log'),
			period: '1d',
			count: 3
		},
		{
			type: 'rotating-file',
			level: 'error',
			path: path.join(__dirname, '../logs', 'error.log'),
			period: '1d',
			count: 3
		}
	]
});

module.exports = logger;

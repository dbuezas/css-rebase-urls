var rework = require('rework'),
	path = require('path'),
	validator = require('validator');

module.exports = function rebaseUrls(args) {
	args = args || {};
	args.contentsBuffer;
	args.filepath;
	args.destpath;
	var css = args.contentsBuffer.toString();
	var foldersToGoUp = args.destpath.split(path.sep).length - 1;
	var myArray = [];
	for (var i = 0; i < foldersToGoUp; i++) {
		myArray.push('..');
	}
	var prefix = myArray.join(path.sep);
	return rework(css)
		.use(rework.url(function (url) {
			if (validator.isURL(url)) {
				return url;
			}
			if (/^(data:.*;.*,)/.test(url)) {
				return url;
			}
			if (/^(\/)/.test(url)) {
				//url is absolute
				return url;
			}
			var p = path.join(prefix, path.dirname(args.filepath), url);
			// console.log('before:', url);
			// console.log('after:', p);
			if (process.platform === 'win32') {
				p = p.replace(/\\/g, '/');
			}

			return p;
		}))
		.toString();
};

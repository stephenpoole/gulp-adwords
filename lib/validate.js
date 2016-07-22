var through = require('through2'),
	chalk = require('chalk'),
	symbols = require('log-symbols'),
	PluginError = require('gulp-util').PluginError,
	zlib = require('zlib'),
	$ = require('cheerio'),
	dir = require('node-dir')

const PLUGIN_NAME = 'gulp-adwords'
var files = []
var html
var verbose = true

var messages = {
	RESULT_OK: "PASSED",
	RESULT_FAILED: "FAILED",
	DOUBLECLICK_STUDIO_CHECK: "DoubleClick studio cannot be used",
	PRIMARY_ASSET_CHECK: "Missing primary asset"
}

var tests = {
	DOUBLECLICK_STUDIO_CHECK: function(html, filepaths) {
		var passed = true
		$(html).find('script').each((i,val) => {
			var src = $(val).attr('src')

			var reg = new RegExp(config.doubleClickURL, 'g')
			reg = reg.exec(src)
			if (reg && Array.isArray(reg) && reg.length) {
				passed = false
			}
		})

		return passed
	},
	PRIMARY_ASSET_CHECK: function(html, filepaths) {
		return html && typeof html === 'string' && html.length
	}
}

var tester = (function() {
	var tests = []

	function log(results) {
		var total = results.length-1
		for (var r in results) {
			var passed = results[r].passed, message = results[r].message, color, last = r == results.length - 1

			var output = passed ? `\t${symbols.success} ${message}` : `\t${symbols.error} ${message}`
			var output1 = `(${Number(r)+1}/${total})`

			if (!last) {
				if (verbose) {
					if (passed) console.log(chalk.green(`${output} ${output1}`))
					else console.log(chalk.red(`${output} ${output1}`))
				}
			} else {
				if (verbose) console.log(`\t--------------------------------------------------`)
				if (passed) console.log(chalk.green.bold(`${output}`))
				else console.log(chalk.red.bold(`${output}`))
			}
		}
	}

	return {
		push: function(fn,err) {
			if (typeof fn === 'function') {
				tests.push({
					test: fn,
					error: err
				})
			}
		},
		run: function() {
			var results = [], globalPassed = true
			for (var i in tests) {
				var passed = tests[i].test.call(this, html, files)
				var message = tests[i].error
				if (globalPassed) globalPassed = passed
				results.push({
					passed: passed,
					message: passed ? messages.RESULT_OK : message
				})
			}

			results.push({
				passed: globalPassed,
				message: !globalPassed ? messages.RESULT_FAILED : messages.RESULT_OK
			})
			log(results)
		}
	}
})()

var config = {
	maxFileSize: '150',
	validExternalAssets: [
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/tweenlite_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/tweenmax_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/cssplugin_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/easepack_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/tweenjs_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/easeljs_.*_min.js',
		'https:\/\/s0\.2mdn\.net\/ads\/studio\/cached_libs\/createjs_.*_min.js',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont\/.*\/webfont.js',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquery\/.*\/jquery.min.js',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/jqueryui\/.*\/jquery-ui.min.js',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/jqueryui\/.*\/themes/smoothness/jquery-ui.css',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquerymobile\/.*\/jquery.mobile.min.css',
		'https:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquerymobile\/.*\/jquery.mobile.min.js',
		'https:\/\/fonts\.googleapis.com/css?.*',
		'https:\/\/tpc\.googlesyndication\.com\/pagead\/gadgets\/html5\/api\/exitapi\.js'
	],
	doubleClickURL: 'https{0,1}\:\/\/s0\.2mdn\.net\/ads\/studio\/enabler\.js',
	validFileTypes: ['css', 'js', 'html', 'gif', 'png', 'jpeg', 'jpg', 'svg']
}

var utils = (function() {
	function isValidFiletype(type) {
		type = type.replace(/\./g, '')
		return config.validFileTypes.indexOf(type) > -1
	}

	function isValidExternalAsset(url) {
		for (var i in config.validExternalAssets) {
			var regex = new RegExp(config.validExternalAssets[i], 'g')
			regex = regex.exec(url)
			if (regex && regex.length) return true
		}
		return false
	}

	function filterFileInputs(files) {
		var exp = []
		for (var file in files) {
			var path = files[file].path.replace(files[file].base, '')

			if (path.match(/\.|\//g) && path.match(/\.|\//g).length) {
				exp.push(path)
			}
		}
		return exp
	}

	return {
		isValidFiletype: isValidFiletype,
		isValidExternalAsset: isValidExternalAsset,
		filterFileInputs: filterFileInputs
	}
})()

module.exports = function(opts) {
	if (!opts) opts = {}
	if ('verbose' in opts && !opts.verbose) verbose = false
	  var stream = through.obj(function(file, enc, cb) {
	    if (file.isStream()) {
	      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
	      return cb();
	    }

	    if (file.isBuffer()) {
	      	if(file.path.endsWith('.html')) html = file.contents.toString()
	      	files.push(file)
	    }

	    this.push(file);
	    cb();
	  }).on('finish', function() {
	  	files = utils.filterFileInputs(files)

	  	tester.push(tests.PRIMARY_ASSET_CHECK, messages.PRIMARY_ASSET_CHECK)
	  	tester.push(tests.DOUBLECLICK_STUDIO_CHECK, messages.DOUBLECLICK_STUDIO_CHECK)
	  	tester.push(function(){return true}, messages.RESULT_FAILED)
	  	tester.run()
	  });

	  return stream;
}


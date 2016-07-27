var through = require('through2'),
	PluginError = require('gulp-util').PluginError,
	zlib = require('zlib'),
	dir = require('node-dir'),
	fs = require('fs'),
	_ = require('lodash')

const PLUGIN_NAME = 'gulp-adwords'

var defaultOpts = {
	name: '',
	verbose: false,
	filesize: 150,
	environment: 'adwords',
	html: undefined,
	files: []
}

var messages = require('./messages.config'),
	config = require('./main.config'),
	tests = require('./tests'),
	utils = require('./utils'),
	tester = require('./tester')

module.exports = function(_opts) {
	var opts = _.cloneDeep(defaultOpts)
	if (!_opts) _opts = {}

	if ('verbose' in _opts && _opts.verbose) opts.verbose = true
	if ('filesize' in _opts) opts.filesize = _opts.filesize
	if ('name' in _opts) opts.name = _opts.name
	if ('environment' in _opts) opts.environment = _opts.environment
		console.log(opts)

	  var stream = through.obj(function(file, enc, cb) {
	    if (file.isStream()) {
	      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
	      return cb();
	    }

	    if (file.isBuffer()) {
	      	if(file.path.endsWith('.html')) opts.html = file.contents.toString()
	      	opts.files.push(file)
	    }

	    this.push(file);
	    cb();
	  }).on('finish', function() {
	  	opts.files = utils.addFileNames(opts.files)

	  	opts.name = opts.name.length ? ' '+opts.name : ' '+utils.getAdName(opts.html)
	  	if (opts.verbose) {
	  		console.log(`\n\tValidating${opts.name}...`)
	  	}

	  	var test = new tester(opts)
	  	test.push(tests.ADVANCED_HTML_CHECK, messages.ADVANCED_HTML_CHECK_FAILED)
	  	test.push(tests.PRIMARY_ASSET_CHECK, messages.PRIMARY_ASSET_CHECK_FAILED)
	  	test.push(tests.DOUBLECLICK_STUDIO_CHECK, messages.DOUBLECLICK_STUDIO_CHECK_FAILED)
	  	test.push(tests.SWIFFY_CHECK, messages.SWIFFY_CHECK_FAILED)
	  	test.push(tests.EXTERNAL_ASSET_CHECK, messages.EXTERNAL_ASSET_CHECK_FAILED)
	  	test.push(tests.SECURE_URL_CHECK, messages.SECURE_URL_CHECK_FAILED)
	  	test.push(tests.FILETYPE_CHECK, messages.FILETYPE_CHECK_FAILED)
	  	test.push(tests.FILES_INVALID_CHARACTER_CHECK, messages.FILES_INVALID_CHARACTER_CHECK_FAILED)
	  	test.push(tests.GWD_ENVIRONMENT_CHECK, messages.GWD_ENVIRONMENT_CHECK_FAILED, {environment: opts.environment})
	  	test.push(tests.MISSING_ASSET_CHECK, messages.MISSING_ASSET_CHECK_FAILED)
	  	test.push(tests.FILESIZE_CHECK, messages.FILESIZE_CHECK_FAILED, {filesize: opts.filesize})
	  	test.push(tests.MULTIPLE_EXITS_CHECK, messages.MULTIPLE_EXITS_CHECK_FAILED)
	  	test.run()
	  });

	  return stream;
}


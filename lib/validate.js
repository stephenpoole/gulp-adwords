var through = require('through2'),
	chalk = require('chalk'),
	symbols = require('log-symbols'),
	PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'gulp-adwords'

module.exports = function(prefixText) {
	// return through.obj(function(file, encoding, cb) {
		if (!prefixText) {
		    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
		  }

		  prefixText = new Buffer(prefixText); // allocate ahead of time

		  // creating a stream through which each file will pass
		  var stream = through.obj(function(file, enc, cb) {
		    if (file.isStream()) {
		      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
		      return cb();
		    }

		    if (file.isBuffer()) {
		      file.contents = Buffer.concat([prefixText, file.contents]);
		    }

		    // make sure the file goes through the next gulp plugin
		    this.push(file);
		    console.log(chalk.green(symbols.success + ' includes size meta tag'))
		    console.log(chalk.red(symbols.error + ' embeds illegal external assets'))
		    // tell the stream engine that we are done with this file
		    cb();
		  });

		  // returning the file stream
		  return stream;
		// })
}


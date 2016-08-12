'use strict'

var $ = require('cheerio'),
	chalk = require('chalk'),
	gutil = require('gulp-util'),
	symbols = require('log-symbols')

var messages = require('./messages.config')

module.exports = class tester {
	constructor(opts) {
		this.opts = opts
		this.tests = []
	}

	push(fn,err,params) {
		if (typeof fn === 'function') {
			this.tests.push({
				test: fn,
				name: err.name,
				code: err.code,
				message: err.message,
				params: params
			})
		}
	}

	run() {
		var results = [], globalPassed = true, errors = []
		for (var i in this.tests) {
			var passed = this.tests[i].test.call(this, this.opts.html, this.opts.files, this.tests[i].params)
			var message = {
				name: this.tests[i].name,
				code: this.tests[i].code,
				message: this.tests[i].message
			}

			if (globalPassed) globalPassed = passed
			if (!passed) errors.push(message)

			results.push({
				passed: passed,
				message: passed ? messages.RESULT_OK : message
			})
		}

		results.push({
			passed: globalPassed,
			message: !globalPassed ? messages.RESULT_FAILED : messages.RESULT_OK
		})

		this.log(results)

		if (this.opts.complete && typeof this.opts.complete === 'function') {
			this.opts.complete.call(this, errors.length ? errors : false)
		}
	}

	log(results) {
		var total = results.length-1
		var newline = false
		for (var r in results) {
			var passed = results[r].passed, message = results[r].message, color, last = r == results.length - 1, first = r == 0

			var output = passed ? `${symbols.success} ${message.message}` : `${symbols.error} ${message.name}: ${message.message}`
			var output1 = `(${Number(r)+1}/${total})`

			if (first) gutil.log(`${this.opts.name}`)
			if (!this.opts.verbose && !passed && !newline) {
				// gutil.log('\n')
				newline = true
			}

			if (!last) {
				if (this.opts.verbose) {
					if (passed) gutil.log(chalk.green(`${output} ${output1}`))
					else gutil.log(chalk.red(`${output} ${output1}`))
				} else {
					if (!passed) gutil.log(chalk.red(`${output} ${output1}`))
				}
			} else {
				if (this.opts.verbose) gutil.log(`--------------------------------------------------`)
				if (passed) gutil.log(chalk.green.bold(`${symbols.success} ${message.message}`))
				else gutil.log(chalk.red.bold(`${symbols.error} ${message.message}`))
			}
		}
	}
}
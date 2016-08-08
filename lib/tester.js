'use strict'

var $ = require('cheerio'),
	chalk = require('chalk'),
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
				error: err,
				params: params
			})
		}
	}

	run() {
		var results = [], globalPassed = true
		for (var i in this.tests) {
			var passed = this.tests[i].test.call(this, this.opts.html, this.opts.files, this.tests[i].params)
			var message = this.tests[i].error
			if (globalPassed) globalPassed = passed
			results.push({
				passed: passed,
				message: passed ? messages.RESULT_OK : messages.RESULT_FAILED + " - "+message
			})
		}

		results.push({
			passed: globalPassed,
			message: !globalPassed ? messages.RESULT_FAILED : messages.RESULT_OK
		})
		this.log(results)
	}

	log(results) {
		var total = results.length-1
		for (var r in results) {
			var passed = results[r].passed, message = results[r].message, color, last = r == results.length - 1

			var output = passed ? `${symbols.success} ${message}` : `${symbols.error} ${message}`
			var output1 = `(${Number(r)+1}/${total})`

			if (!last) {
				if (this.opts.verbose) {
					if (passed) console.log(chalk.green(`\t${output} ${output1}`))
					else console.log(chalk.red(`\t${output} ${output1}`))
				} else {
					if (!passed) console.log(chalk.red(`\t${output} ${output1}`))
				}
			} else {
				if (this.opts.verbose) {
					console.log(`\t--------------------------------------------------`)
					if (passed) console.log(chalk.green.bold(`\t${output}`))
					else console.log(chalk.red.bold(`\t${output}`))
				} else {
					if (passed) console.log(`\t${this.opts.name}: ` + chalk.green.bold(`${output}`))
					else console.log(`\t${this.opts.name}: ` + chalk.red.bold(`${output}`))
				}
			}
		}
	}
}
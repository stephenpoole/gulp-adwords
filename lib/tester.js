const $ = require('cheerio'),
    chalk = require('chalk'),
    gutil = require('gulp-util'),
    symbols = require('log-symbols');

import { Messages } from './messages.config';

export class Tester {
    constructor(opts) {
        this.opts = opts;
        this.tests = [];
    }

    push(fn, err, params) {
        if (typeof fn === 'function') {
            this.tests.push({
                test: fn,
                name: err.name,
                code: err.code,
                message: err.message,
                params: params
            });
        }
    }

    run() {
        var results = [],
            globalPassed = true;

        for (var i in this.tests) {
            var passed = this.tests[i].test.call(
                this,
                this.opts.html,
                this.opts.files,
                this.tests[i].params
            );
            var message = {
                name: this.tests[i].name,
                code: this.tests[i].code,
                message: this.tests[i].message
            };

            if (!passed.result) {
                globalPassed = false;
            }

            results.push({
                passed: passed.result,
                context: passed.context,
                message: passed.passed ? Messages.RESULT_OK : message
            });
        }

        this.log(results, globalPassed);

        if (this.opts.complete && typeof this.opts.complete === 'function') {
            this.opts.complete.call(this);
        }
    }

    log(results, passedOverall) {
        var total = results.length - 1;
        var newline = false;

        for (var r in results) {
            var passed =
                    typeof results[r].passed === 'boolean'
                        ? !!results[r].passed
                        : true,
                message = results[r].message,
                color,
                last = r == results.length - 1,
                first = r == 0;

            var output = passed ? '' : message.name;
            var output1 = `(${Number(r) + 1}/${total})`;

            if (first)
                gutil.log(
                    `${this.opts.name}` +
                        ' ' +
                        (passedOverall
                            ? chalk.green.bold(`${symbols.success}`)
                            : chalk.red.bold(`${symbols.error}`))
                );
            if (!passed && !newline) {
                // gutil.log('\n')
                newline = true;
            }

            if (!passed) gutil.log(chalk.red(`\t${output} ${output1}`));

            if (!!results[r].context) {
                var { name, message, url, payload } = results[r].context;
                var output2 = `  \t${name} ${message}`;

                if (!!url) {
                    output2 += `\n\t\t  ${url}`;
                }
                if (!!payload) {
                    output2 += `\n\t\t  ${payload.reduce(
                        (str, a) => a + ', ' + str,
                        ''
                    )}`;
                }
                gutil.log(chalk.yellow(output2));
            }
        }
    }
}

import { Messages } from './messages.config';
import { Tests } from './tests';
import { Tester } from './tester';
import { Utils } from './utils';

const through = require('through2'),
    PluginError = require('gulp-util').PluginError,
    zlib = require('zlib'),
    gutil = require('gulp-util'),
    dir = require('node-dir'),
    fs = require('fs'),
    _ = require('lodash');

const PLUGIN_NAME = 'gulp-adwords';
const defaultOpts = {
    name: '',
    filesize: 150,
    environment: 'adwords',
    html: undefined,
    files: []
};

export const plugin = function(_opts) {
    var opts = _.cloneDeep(defaultOpts);
    if (!_opts) _opts = {};
    if ('filesize' in _opts) opts.filesize = _opts.filesize;
    if ('name' in _opts) opts.name = _opts.name;
    if ('environment' in _opts) opts.environment = _opts.environment;
    if ('customTests' in _opts) opts.customTests = _opts.customTests;
    if ('complete' in _opts) opts.complete = _opts.complete;

    var stream = through
        .obj(function(file, enc, cb) {
            if (file.isStream()) {
                this.emit(
                    'error',
                    new PluginError(PLUGIN_NAME, 'Streams are not supported!')
                );
                return cb();
            }

            if (file.isBuffer()) {
                if (file.path.endsWith('.html'))
                    opts.html = file.contents.toString();
                opts.files.push(file);
            }

            this.push(file);
            cb();
        })
        .on('finish', function() {
            opts.files = Utils.addFileNames(opts.files);

            opts.name = opts.name.length
                ? ' ' + opts.name
                : ' ' + Utils.getAdName(opts.html);

            var test = new Tester(opts);
            test.push(
                Tests.ADVANCED_HTML_CHECK,
                Messages.ADVANCED_HTML_CHECK_FAILED
            );
            test.push(
                Tests.PRIMARY_ASSET_CHECK,
                Messages.PRIMARY_ASSET_CHECK_FAILED
            );
            test.push(
                Tests.DOUBLECLICK_STUDIO_CHECK,
                Messages.DOUBLECLICK_STUDIO_CHECK_FAILED
            );
            test.push(Tests.SWIFFY_CHECK, Messages.SWIFFY_CHECK_FAILED);
            test.push(
                Tests.EXTERNAL_ASSET_CHECK,
                Messages.EXTERNAL_ASSET_CHECK_FAILED
            );
            test.push(Tests.SECURE_URL_CHECK, Messages.SECURE_URL_CHECK_FAILED);
            test.push(Tests.FILETYPE_CHECK, Messages.FILETYPE_CHECK_FAILED);
            test.push(
                Tests.FILES_INVALID_CHARACTER_CHECK,
                Messages.FILES_INVALID_CHARACTER_CHECK_FAILED
            );
            test.push(
                Tests.GWD_ENVIRONMENT_CHECK,
                Messages.GWD_ENVIRONMENT_CHECK_FAILED,
                { environment: opts.environment }
            );
            test.push(
                Tests.MISSING_ASSET_CHECK,
                Messages.MISSING_ASSET_CHECK_FAILED
            );
            test.push(Tests.FILESIZE_CHECK, Messages.FILESIZE_CHECK_FAILED, {
                filesize: opts.filesize
            });
            test.push(
                Tests.MULTIPLE_EXITS_CHECK,
                Messages.MULTIPLE_EXITS_CHECK_FAILED
            );

            if ('customTests' in opts && !!opts.customTests) {
                for (var i in opts.customTests) {
                    if (
                        !('test' in opts.customTests[i]) ||
                        !('message' in opts.customTests[i]) ||
                        !('name' in opts.customTests[i])
                    )
                        continue;
                    if (
                        typeof opts.customTests[i].test === 'function' &&
                        typeof opts.customTests[i].message === 'string' &&
                        typeof opts.customTests[i].name === 'string'
                    ) {
                        var message = {
                            message: opts.customTests[i].message,
                            code: undefined,
                            name: opts.customTests[i].name
                        };
                        test.push(opts.customTests[i].test, message);
                    }
                }
            }
            test.run();
        });

    return stream;
};

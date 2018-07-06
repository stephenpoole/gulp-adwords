const $ = require('cheerio');

import { Utils } from './Utils';
import { MainConfig } from './main.config';
import { Context } from './messages.config';

function failed(context) {
    return { result: false, context };
}

function passed(context) {
    return { result: true, context };
}

export let Tests = {
    ADVANCED_HTML_CHECK: function(html, files) {
        //check if ad.size meta tag exists
        var metaTag = $(html).find('meta[name="ad.size"]');
        if (!metaTag.length) return failed(Context.AD_SIZE_META_NONEXISTANT);

        //check if content attribute is on ad.size tag and is valid
        var content = metaTag.attr('content');
        var regex = content.match(
            /width=\d{2,5},height=\d{2,5}|height=\d{2,5},width=\d{2,5}/g
        );
        if (!content.length || !Utils.regexMatched(regex))
            return failed(Context.AD_SIZE_META_INVALID);

        //check if html includes doctype, html, head, body tags
        if (
            !Utils.regexMatched(
                html.match(
                    /(<!DOCTYPE html>|<!DOCTYPE HTML>)[^]*<html>[^]*<head>[^]*<\/head>[^]*<body>[^]*<\/body>[^]*<\/html>/g
                )
            )
        ) {
            return failed(Context.REQUIRED_HTML_TAGS_MISSING);
        }

        return passed();
    },
    DOUBLECLICK_STUDIO_CHECK: function(html, files) {
        var didPass = true;
        $(html)
            .find('script')
            .each((i, val) => {
                var src = $(val).attr('src');

                var reg = new RegExp(MainConfig.doubleClickURL, 'g');
                reg = reg.exec(src);
                if (Utils.regexMatched(reg)) {
                    didPass = false;
                }
            });

        return didPass ? passed() : failed(Context.DOUBLECLICK_URL_INVALID);
    },
    SWIFFY_CHECK: function(html, files) {
        var didPass = true;
        $(html)
            .find('script')
            .each((i, val) => {
                var src = $(val).attr('src');

                var reg = new RegExp(MainConfig.swiffyURL, 'g');
                reg = reg.exec(src);
                if (Utils.regexMatched(reg)) {
                    didPass = false;
                }
            });

        return didPass ? passed() : failed(Context.SWIFFY_URL_INVALID);
    },
    PRIMARY_ASSET_CHECK: function(html, files) {
        var sawHTML = 0;
        for (var i in files) {
            var file = files[i];
            var match = file.name.match(/\.html$/g);
            if (Utils.regexMatched(match)) {
                sawHTML++;
                if (file.name.indexOf('/') > -1) return false;
            }
        }
        var didPass =
            html && typeof html === 'string' && html.length && sawHTML == 1;
        return didPass ? passed() : failed(Context.HTML_FILE_MISSING);
    },
    EXTERNAL_ASSET_CHECK: function(html, files) {
        var didPass = true;
        var invalidAssets = [];
        $(html)
            .find('img,script,link')
            .each((i, val) => {
                var url;
                switch (val.type) {
                    case 'img':
                    case 'script':
                        url = $(val).attr('src');
                        break;
                    case 'link':
                        url = $(val).attr('href');
                        break;
                }

                if (!!url && url.length) {
                    var match = url.match(/^.*:\/\/|^\/\//g); //check for protocol
                    if (Utils.regexMatched(match)) {
                        if (!Utils.isValidExternalAsset(url)) {
                            didPass = false;
                            invalidAssets.push(url);
                        }
                    }
                }
            });

        if (didPass) {
            return passed();
        } else {
            let context = Context.INVALID_EXTERNAL_ASSET;
            context.payload = invalidAssets;
            return failed(context);
        }
    },
    SECURE_URL_CHECK: function(html, files) {
        var didPass = true;
        var invalidAssets = [];
        $(html)
            .find('img,script,link')
            .each((i, val) => {
                var url;
                switch (val.type) {
                    case 'img':
                    case 'script':
                        url = $(val).attr('src');
                        break;
                    case 'link':
                        url = $(val).attr('href');
                        break;
                }

                if (!!url && url.length) {
                    var match = url.match(/^.*:\/\/|^\/\//g); //check for protocol
                    if (Utils.regexMatched(match)) {
                        match = url.match(/https:\/\//g); //check for https
                        if (!Utils.regexMatched(match)) {
                            didPass = false;
                            invalidAssets.push(url);
                        }
                    }
                }
            });

        if (didPass) {
            return passed();
        } else {
            let context = Context.INSECURE_URL_FOUND;
            context.payload = invalidAssets;
            return failed(context);
        }
    },
    FILETYPE_CHECK: function(html, files) {
        let invalidAssets = [];
        let didPass = true;
        for (var i in files) {
            var file = files[i];
            var regex = file.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/g);

            if (Utils.regexMatched(regex)) {
                if (!Utils.isValidFiletype(regex[0])) {
                    didPass = false;
                    invalidAssets.push(regex[0]);
                }
            }
        }

        if (didPass) {
            return passed();
        } else {
            let context = Context.INVALID_FILETYPE_FOUND;
            context.payload = invalidAssets;
            return failed(context);
        }
    },
    FILES_INVALID_CHARACTER_CHECK: function(html, files) {
        var didPass = true;
        var invalidAssets = [];

        for (var i in files) {
            var file = files[i];
            var name =
                file.name.indexOf('\\') > -1
                    ? file.name
                          .substring(file.name.lastIndexOf('\\') + 1)
                          .trim()
                    : file.name.trim();

            let regex = new RegExp(MainConfig.validFilenameCharacters, 'g');
            var match = regex.exec(name);
            if (name.length && !Utils.regexMatched(match)) {
                console.log('"' + name + '"', match, regex);
                didPass = false;
                invalidAssets.push(file.name);
            }
        }

        if (didPass) {
            return passed();
        } else {
            let context = Context.INVALID_CHARACTER_IN_FILENAME;
            context.payload = invalidAssets;
            return failed(context);
        }
    },
    GWD_ENVIRONMENT_CHECK: function(html, files, params) {
        // <meta name="environment" content="gwd-adwords">

        var environment;
        if (params && 'environment' in params && !!params.environment) {
            environment = params.environment;
        } else {
            return passed();
        }

        var metaTag = $(html).find('meta[name="environment"]');
        if (!(metaTag && metaTag.length)) {
            return failed(Context.ENV_SPECIFIED_BUT_NOT_FOUND);
        }
        var content = metaTag.attr('content');

        if (!(content && content.length)) {
            return failed(Context.ENV_SPECIFIED_BUT_NOT_FOUND);
        }
        if (content != 'gwd-' + environment) {
            return failed(Context.ENV_MISMATCH);
        }
        return passed();
    },
    MISSING_ASSET_CHECK: function(html, files) {
        var didPass = true;
        var invalidAssets = [];

        var filepaths = [];
        for (var i in files) {
            filepaths.push(files[i].name.replace(/[\/\\]/g, ''));
        }

        $(html)
            .find('img,script,link')
            .each((i, val) => {
                var url;
                var type = val.type == 'script' ? val.type : val.name;

                switch (type) {
                    case 'img':
                    case 'script':
                        url = $(val).attr('src');
                        break;
                    case 'link':
                        url = $(val).attr('href');
                        break;
                }

                if (!!url && url.length) {
                    var match = url.match(/^.*:\/\/|^\/\//g); //check for a protocol

                    if (!Utils.regexMatched(match)) {
                        var match = url.match(/^(.*\/)([^\/]*)$|(^\w*\.\w*)/g); //check for a valid filepath/url
                        if (Utils.regexMatched(match)) {
                            url = url.replace(/^\.\/|^\//g, ''); //remove any ./ at the beginning or the url

                            if (
                                filepaths.indexOf(url.replace(/[\/\\]/g, '')) ==
                                -1
                            ) {
                                didPass = false;
                                invalidAssets.push(url);
                            }
                        } else {
                            invalidAssets.push(url);
                        }
                    }
                }
            });

        if (didPass) {
            return passed();
        } else {
            var context = Context.FILE_NOT_FOUND;
            context.payload = invalidAssets;
            return failed(context);
        }
    },
    FILESIZE_CHECK: function(html, files, params) {
        var filesize;
        if (params && 'filesize' in params) filesize = params.filesize;
        if (!filesize) return false;

        var total = 0;
        for (var i in files) {
            total += files[i].stat.size;
        }
        if (total / 1000 < filesize) {
            return passed();
        } else {
            return failed();
        }
    },
    MULTIPLE_EXITS_CHECK: function(html, files) {
        if (!(html && html.length)) return passed();
        var match = html.match(/Enabler\.exit\(|Enabler\.exitOverride\(/g);
        if (Utils.regexMatched(match)) {
            if (match.length > 1) return failed();
        }
        return passed();
    }
};

var $ = require('cheerio')

var utils = require('./utils'),
	config = require('./main.config')

module.exports = {
	ADVANCED_HTML_CHECK: function(html, files) {
		//check if ad.size meta tag exists
		var metaTag = $(html).find('meta[name="ad.size"]')
		if (!metaTag.length) return false

		//check if content attribute is on ad.size tag and is valid
		var content = metaTag.attr('content')
		var regex = content.match(/width=\d{2,5},height=\d{2,5}|height=\d{2,5},width=\d{2,5}/g)
		if (!content.length || !utils.regexMatched(regex)) return false

		//check if html includes doctype, html, head, body tags
		return utils.regexMatched(html.match(/(<!DOCTYPE html>|<!DOCTYPE HTML>)(.|\s)*<html>(.|\s)*<head>(.|\s)*<\/head>(.|\s)*<body>(.|\s)*<\/body>(.|\s)*<\/html>/g))
	},
	DOUBLECLICK_STUDIO_CHECK: function(html, files) {
		var passed = true
		$(html).find('script').each((i,val) => {
			var src = $(val).attr('src')

			var reg = new RegExp(config.doubleClickURL, 'g')
			reg = reg.exec(src)
			if (utils.regexMatched(reg)) {
				passed = false
			}
		})

		return passed
	},
	SWIFFY_CHECK: function(html, files) {
		var passed = true
		$(html).find('script').each((i,val) => {
			var src = $(val).attr('src')

			var reg = new RegExp(config.swiffyURL, 'g')
			reg = reg.exec(src)
			if (utils.regexMatched(reg)) {
				passed = false
			}
		})

		return passed
	},
	PRIMARY_ASSET_CHECK: function(html, files) {
		var sawHTML=0
		for (var i in files) {
			var file = files[i]
			var match = file.name.match(/\.html$/g)
			if (utils.regexMatched(match)) {
				sawHTML++
				if (file.name.indexOf('/') > -1) return false
			}
		}
		return html && typeof html === 'string' && html.length && sawHTML == 1
	},
	EXTERNAL_ASSET_CHECK: function(html, files) {
		var passed = true
		$(html).find('img,script,link').each((i,val) => {
			if (!passed) return
			var url
			switch(val.type) {
				case "img":
				case "script":
					url = $(val).attr('src')
					break;
				case "link":
					url = $(val).attr('href')
					break;
			}

			if (!!url && url.length) {
				var match = url.match(/^.*:\/\/|^\/\//g)	//check for protocol
				if (utils.regexMatched(match)) {
					if (passed) passed = utils.isValidExternalAsset(url)
				}
			}
		})
		return passed
	},
	SECURE_URL_CHECK: function(html, files) {
		var passed = true
		$(html).find('img,script,link').each((i,val) => {
			if (!passed) return
			var url
			switch(val.type) {
				case "img":
				case "script":
					url = $(val).attr('src')
					break;
				case "link":
					url = $(val).attr('href')
					break;
			}

			if (!!url && url.length) {
				var match = url.match(/^.*:\/\/|^\/\//g)	//check for protocol
				if (utils.regexMatched(match)) {
					match = url.match(/https:\/\//g)	//check for https
					if (passed && !utils.regexMatched(match)) passed = false
				}
			}
		})
		return passed
	},
	FILETYPE_CHECK: function(html, files) {
		for (var i in files) {
			var file = files[i]
			var regex = file.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/g)

			if (utils.regexMatched(regex)) {
				if (!utils.isValidFiletype(regex[0])) return false
			}
		}
		return true
	},
	FILES_INVALID_CHARACTER_CHECK: function(html, files) {
		var regex = new RegExp(config.validFilenameCharacters, 'g')

		for (var i in files) {
			var file = files[i]
			var match = regex.exec(file.name)
			if (utils.regexMatched(match)) return false
		}
		return true
	},
	GWD_ENVIRONMENT_CHECK: function(html, files, params) {
		// <meta name="environment" content="gwd-adwords">
		var environment
		if (params && 'environment' in params) environment = params.environment
		if (!environment || !environment.length) return false

		var metaTag = $(html).find('meta[name="environment"]')
		if (!(metaTag && metaTag.length)) return true
		var content = metaTag.attr('content')

		// if (!environment.length && !(content && content.length)) return true
		if (!(content && content.length)) return true
		if (content != "gwd-"+environment) return false
		return true
	},
	MISSING_ASSET_CHECK: function(html, files) {
		var passed = true

		var filepaths = []
		for (var i in files) {
			filepaths.push(files[i].name)
		}

		$(html).find('img,script,link').each((i,val) => {
			if (!passed) return
			var url
			switch(val.type) {
				case "img":
				case "script":
					url = $(val).attr('src')
					break;
				case "link":
					url = $(val).attr('href')
					break;
			}

			if (!!url && url.length) {
				var match = url.match(/^.*:\/\/|^\/\//g)	//check for a protocol

				if (!utils.regexMatched(match)) {
					var match = url.match(/^(.*\/)([^\/]*)$|(^\w*\.\w*)/g)	//check for a valid filepath/url
					if (utils.regexMatched(match)) {
						url = url.replace(/^\.\/|^\//g, '')	//remove any ./ at the beginning or the url
						// console.log(`filepath found: ${url}`)
						if (filepaths.indexOf(url) == -1) passed = false
					} else {
						//invalid file name or path, return an error
						// console.log(`invalid filepath found: ${url}`)
						passed = false
					}
				} else {
					//protocol detected, ignore
					// console.log(`ignoring: ${url}`)
				}
			}
		})
		return passed
	},
	FILESIZE_CHECK: function(html, files, params) {
		var filesize
		if (params && 'filesize' in params) filesize = params.filesize
		if (!filesize) return false
			
		var total = 0
		for (var i in files) {
			total += files[i].stat.size
		}
		return total/1000 < filesize
	},
	MULTIPLE_EXITS_CHECK: function(html, files) {
		if (!(html && html.length)) return true
		var match = html.match(/Enabler\.exit\(|Enabler\.exitOverride\(/g)
		if (utils.regexMatched(match)) {
			if (match.length > 1) return false
		}
		return true
	}
}
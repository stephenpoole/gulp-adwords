var config = require('./main.config')

module.exports = {
	isValidFiletype: function(type) {
		type = type.replace(/\./g, '')
		return config.validFileTypes.indexOf(type) > -1
	},
	isValidExternalAsset: function(url) {
		var match = ""
		for (var i in config.validExternalAssets) {
			match += config.validExternalAssets[i] + "|"
		}
		var regex = new RegExp(match, 'g')
		regex = regex.exec(url)

		return !!regex && Array.isArray(regex) && 0 in regex && regex[0].length
	},
	addFileNames: function(files) {
		for (var file in files) {
			var path = files[file].path.replace(files[file].base, '')

			// if (path.match(/\.|\//g) && path.match(/\.|\//g).length) {
				files[file].name = path
			// }
		}
		return files
	},
	regexMatched: function(regex) {
		return regex && Array.isArray(regex) && regex.length
	},
	getAdName: function(html) {
		var regex = new RegExp(/<title>(.*)<\/title>/g)
		var match = regex.exec(html)
		if (this.regexMatched(match) && match.length > 1) {
			return match[1]
		}
		return ''
	}
}
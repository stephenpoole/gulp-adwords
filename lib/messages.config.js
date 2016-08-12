var messages = {
	GENERIC_FAILURE: {
		message: "Generic failure",
		code: 1
	},
	DOUBLECLICK_STUDIO_CHECK_FAILED: {
		message: "DoubleClick studio cannot be used",
		code: 2
	},
	SWIFFY_CHECK_FAILED: {
		message: "Swiffy cannot be used",
		code: 3
	},
	PRIMARY_ASSET_CHECK_FAILED: {
		message: "Missing primary asset or primary asset is not in the root directory",
		code: 4
	},
	EXTERNAL_ASSET_CHECK_FAILED: {
		message: "Invalid external asset found",
		code: 5
	},
	SECURE_URL_CHECK_FAILED: {
		message: "External asset is not secure",
		code: 6
	},
	ADVANCED_HTML_CHECK_FAILED: {
		message: "HTML is invalid or ad.size meta tag is missing or invalid",
		code: 7
	},
	FILETYPE_CHECK_FAILED: {
		message: "Asset with an invalid filetype found",
		code: 8
	},
	FILES_INVALID_CHARACTER_CHECK_FAILED: {
		message: "Asset with invalid characters in path/name found",
		code: 9
	},
	GWD_ENVIRONMENT_CHECK_FAILED: {
		message: "Google web designer environment does not match",
		code: 10
	},
	MISSING_ASSET_CHECK_FAILED: {
		message: "An asset referenced in the HTML was not found",
		code: 11
	},
	FILESIZE_CHECK_FAILED: {
		message: "Total filesize is too large",
		code: 12
	},
	MULTIPLE_EXITS_CHECK_FAILED: {
		message: "Multiple exits are not allowed",
		code: 13
	},
	RESULT_FAILED: {
		message: "FAILED",
		code: 14
	},
	RESULT_OK: {
		message: "PASSED",
		code: 0
	}
}

for (var msg in messages) {
	messages[msg].name = msg
}
module.exports = messages
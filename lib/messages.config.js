export let Messages = {
    GENERIC_FAILURE: {
        name: 'GENERIC_FAILURE',
        message: 'Generic failure',
        code: 1
    },
    DOUBLECLICK_STUDIO_CHECK_FAILED: {
        name: 'DOUBLECLICK_STUDIO_CHECK_FAILED',
        message: 'DoubleClick studio cannot be used',
        code: 2
    },
    SWIFFY_CHECK_FAILED: {
        name: 'SWIFFY_CHECK_FAILED',
        message: 'Swiffy cannot be used',
        code: 3
    },
    PRIMARY_ASSET_CHECK_FAILED: {
        name: 'PRIMARY_ASSET_CHECK_FAILED',
        message:
            'Missing primary asset or primary asset is not in the root directory',
        code: 4
    },
    EXTERNAL_ASSET_CHECK_FAILED: {
        name: 'EXTERNAL_ASSET_CHECK_FAILED',
        message: 'Invalid external asset found',
        code: 5
    },
    SECURE_URL_CHECK_FAILED: {
        name: 'SECURE_URL_CHECK_FAILED',
        message: 'External asset is not secure',
        code: 6
    },
    ADVANCED_HTML_CHECK_FAILED: {
        name: 'ADVANCED_HTML_CHECK_FAILED',
        message: 'HTML is invalid or ad.size meta tag is missing or invalid',
        code: 7
    },
    FILETYPE_CHECK_FAILED: {
        name: 'FILETYPE_CHECK_FAILED',
        message: 'Asset with an invalid filetype found',
        code: 8
    },
    FILES_INVALID_CHARACTER_CHECK_FAILED: {
        name: 'FILES_INVALID_CHARACTER_CHECK_FAILED',
        message: 'Asset with invalid characters in path/name found',
        code: 9
    },
    GWD_ENVIRONMENT_CHECK_FAILED: {
        name: 'GWD_ENVIRONMENT_CHECK_FAILED',
        message: 'Google web designer environment does not match',
        code: 10
    },
    MISSING_ASSET_CHECK_FAILED: {
        name: 'MISSING_ASSET_CHECK_FAILED',
        message: 'An asset referenced in the HTML was not found',
        code: 11
    },
    FILESIZE_CHECK_FAILED: {
        name: 'FILESIZE_CHECK_FAILED',
        message: 'Total filesize is too large',
        code: 12
    },
    MULTIPLE_EXITS_CHECK_FAILED: {
        name: 'MULTIPLE_EXITS_CHECK_FAILED',
        message: 'Multiple exits are not allowed',
        code: 13
    },
    RESULT_FAILED: {
        name: 'RESULT_FAILED',
        message: 'FAILED',
        code: 14
    },
    RESULT_OK: {
        name: 'RESULT_OK',
        message: 'PASSED',
        code: 0
    }
};

export let Context = {
    AD_SIZE_META_NONEXISTANT: {
        name: 'AD_SIZE_META_NONEXISTANT',
        message: 'Make sure size meta tag exists.',
        url: 'https://support.google.com/adwords/answer/6335679?hl=en'
    },
    AD_SIZE_META_INVALID: {
        name: 'AD_SIZE_META_INVALID',
        message: 'Size meta tag is not valid.',
        url: 'https://support.google.com/adwords/answer/6335679n'
    },
    REQUIRED_HTML_TAGS_MISSING: {
        name: 'REQUIRED_HTML_TAGS_MISSING',
        message: 'Make sure html, head, body and doctype tags exist.'
    },
    DOUBLECLICK_URL_INVALID: {
        name: 'DOUBLECLICK_URL_INVALID',
        message: 'Make sure the DoubleClick studio url is correct.',
        url: 'https://s0.2mdn.net/ads/studio/enabler.js'
    },
    SWIFFY_URL_INVALID: {
        name: 'SWIFFY_URL_INVALID',
        message: 'Make sure the Swiffy url is correct.',
        url: 'https://www.gstatic.com/swiffy/v.*/runtime.js'
    },
    HTML_FILE_MISSING: {
        name: 'HTML_FILE_MISSING',
        message: "Couldn't find a .html file."
    },
    INVALID_EXTERNAL_ASSET: {
        name: 'INVALID_EXTERNAL_ASSET',
        message:
            'Found an external script, image, or link from an invalid domain. You must include assets locally or use an asset on an AdWords whitelisted domain.'
    },
    INSECURE_URL_FOUND: {
        name: 'INSECURE_URL_FOUND',
        message: 'Make sure to use https.'
    },
    INVALID_FILETYPE_FOUND: {
        name: 'INVALID_FILETYPE_FOUND',
        message: 'Make sure to include only AdWords approved filetypes.',
        url: 'https://support.google.com/adwords/answer/6335679'
    },
    INVALID_CHARACTER_IN_FILENAME: {
        name: 'INVALID_CHARACTER_IN_FILENAME',
        message: 'Make sure to use only characters approved by AdWords.',
        url: 'https://support.google.com/adwords/answer/6335679'
    },
    ENV_SPECIFIED_BUT_NOT_FOUND: {
        name: 'ENV_SPECIFIED_BUT_NOT_FOUND',
        message:
            "The specified environment wasn't found. You must add an environment meta tag.",
        url: 'https://support.google.com/adwords/answer/6335679'
    },
    ENV_MISMATCH: {
        name: 'ENV_MISMATCH',
        message: "The specified environment doesn't match what was found."
    },
    FILE_NOT_FOUND: {
        name: 'FILE_NOT_FOUND',
        message:
            'A file referenced in the html was not found in the filesystem.'
    }
};

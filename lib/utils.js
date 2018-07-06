import { MainConfig } from './main.config';

export class Utils {
    static isValidFiletype(type) {
        type = type.replace(/\./g, '');
        return MainConfig.validFileTypes.indexOf(type) > -1;
    }

    static isValidExternalAsset(url) {
        var match = '';
        for (var i in MainConfig.validExternalAssets) {
            match += MainConfig.validExternalAssets[i] + '|';
        }
        var regex = new RegExp(match, 'g');
        regex = regex.exec(url);

        return !!regex && Array.isArray(regex) && 0 in regex && regex[0].length;
    }

    static addFileNames(files) {
        for (var file in files) {
            var path = files[file].path.replace(files[file].base, '');
            files[file].name = path;
        }
        return files;
    }

    static regexMatched(regex) {
        return regex && Array.isArray(regex) && regex.length;
    }

    static getAdName(html) {
        var regex = new RegExp(/<title>(.*)<\/title>/g);
        var match = regex.exec(html);
        if (this.regexMatched(match) && match.length > 1) {
            return match[1];
        }
        return '';
    }
}

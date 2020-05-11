"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapRusToEngSymbols = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'j',
    'з': 'z',
    'и': 'i',
    'й': 'i',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'shch',
    'ы': 'y',
    'э': 'e',
    'ю': 'u',
    'я': 'ya',
    ' ': '-',
};
exports.getSlugString = function (str) {
    return Array.from(str).reduce(function (result, char) {
        if (result[result.length - 1] === '-' && char === ' ' || char === '-')
            return result;
        var nextChar = mapRusToEngSymbols[char] || '';
        if (!nextChar && /[a-zA-Z]/.test(char)) {
            nextChar = char;
        }
        return "" + result + nextChar.toLowerCase();
    });
};
exports.default = {
    getSlugString: exports.getSlugString,
};

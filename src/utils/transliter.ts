const mapRusToEngSymbols: { [key: string]: string } = {
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

export const getSlugString = (str: string): string => {
  return Array.from(str).reduce((result: string, char: string): string => {
    if (result[result.length - 1] === '-' && char === ' ' || char === '-') return result;

    let nextChar = mapRusToEngSymbols[char] || '';

    if (!nextChar && /[a-zA-Z]/.test(char)) {
      nextChar = char;
    }

    return `${result}${nextChar.toLowerCase()}`;
  });
};

export default {
  getSlugString,
};

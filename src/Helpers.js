export function addHelpfulPrototypes () {
  // Warn if overriding existing method
  if (String.prototype.capitalize)
    console.warn("Overriding existing String.prototype.capitalize. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  // Warn if overriding existing method
  if (String.prototype.replaceAt)
    console.warn("Overriding existing String.prototype.replaceAt. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

  // Warn if overriding existing method
  if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
      return false;

    for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
          return false;       
      }           
      else if (this[i] != array[i]) { 
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;   
      }           
    }       
    return true;
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

  // Warn if overriding existing method
  if (Array.prototype.unique)
    console.warn("Overriding existing Array.prototype.unique. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  // attach the .unique method to Array's prototype to call it on any array
  Array.prototype.unique = function () {
    return this.filter(function(item, position, array) {
      return array.indexOf(item) == position;
    });
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'unique', {enumerable: false});

  // Warn if overriding existing method
  if (Array.prototype.sortCustomOrder)
    console.warn("Overriding existing Array.prototype.sortCustomOrder. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  // attach the .sortCustomOrder method to Array's prototype to call it on any array
  Array.prototype.sortCustomOrder = function (sortOrderArray, sortKey = null) {
    // Depends on above prototype
    sortOrderArray = sortOrderArray.unique()
      .map(item => { return item.toLowerCase() });

    if (sortOrderArray.length > 0) {
      return this.sort(function (a, b) {
        if (sortKey) {
          const aValue = a[sortKey].toLowerCase(),
            bValue = b[sortKey].toLowerCase();
          return sortOrderArray.indexOf(aValue) - sortOrderArray.indexOf(bValue);
        }

        const aValue = a.toLowerCase(),
            bValue = b.toLowerCase();
        return sortOrderArray.indexOf(aValue) - sortOrderArray.indexOf(bValue);
      });
    }

    // If an empty sort array is given, sort it alphabetically.
    if (sortKey) {
      return this.sort(function (a, b) {
        if (a[sortKey] == b[sortKey]) return 0;
        return (a[sortKey] < b[sortKey]) ? -1 : 1;
      });
    }

    return this.sort();
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'sortCustomOrder', {enumerable: false});

  // Warn if overriding existing method
  if (Object.prototype.isEmpty)
    console.warn("Overriding existing Object.prototype.isEmpty. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  Object.prototype.isEmpty = function () {
    for(let key in this) {
      if(this.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  // Hide method from for-in loops
  Object.defineProperty(Object.prototype, 'isEmpty', {enumerable: false});
}

export function characterIsUppercase (character) {
  return character === character.toUpperCase();
}

export function timestampInSeconds () {
  return Math.round(Date.now() / 1000);
}

export function getWordsStats (words, partsOfSpeech, isCaseSensitive = false) {
  const wordStats = {
    numberOfWords: [
      {
        name: 'Total',
        value: words.length,
      },
    ],
    wordLength: {
      shortest: 0,
      longest: 0,
      average: 0,
    },
    letterDistribution: [
      // {
      //   letter: '',
      //   number: 0,
      //   percentage: 0.00,
      // }
    ],
    totalLetters: 0,
  };

  partsOfSpeech.forEach(partOfSpeech => {
    const wordsWithPartOfSpeech = words.filter(word => word.partOfSpeech === partOfSpeech);
    wordStats.numberOfWords.push({
      name: partOfSpeech,
      value: wordsWithPartOfSpeech.length,
    });
  });

  wordStats.numberOfWords.push({
    name: 'Unclassified',
    value: words.filter(word => !partsOfSpeech.includes(word.partOfSpeech)).length,
  });

  let totalLetters = 0;
  const numberOfLetters = {};

  words.forEach(word => {
    const shortestWord = wordStats.wordLength.shortest;
    const longestWord = wordStats.wordLength.longest;
    const wordLetters = word.name.split('');
    const lettersInWord = wordLetters.length;

    totalLetters += lettersInWord;

    if (shortestWord === 0 || lettersInWord < shortestWord) {
      wordStats.wordLength.shortest = lettersInWord;
    }

    if (longestWord === 0 || lettersInWord > longestWord) {
      wordStats.wordLength.longest = lettersInWord;
    }

    wordLetters.forEach(letter => {
      const letterToUse = isCaseSensitive ? letter : letter.toLowerCase();
      if (!numberOfLetters.hasOwnProperty(letterToUse)) {
        numberOfLetters[letterToUse] = 1;
      } else {
        numberOfLetters[letterToUse]++;
      }
    });
  });

  wordStats.totalLetters = totalLetters;
  wordStats.wordLength.average = totalLetters / words.length;

  for (const letter in numberOfLetters) {
    if (numberOfLetters.hasOwnProperty(letter)) {
      const number = numberOfLetters[letter];
      wordStats.letterDistribution.push({
        letter,
        number,
        percentage: number / totalLetters,
      });
    }
  }

  wordStats.letterDistribution.sort((a, b) => {
    if (a.percentage === b.percentage) return 0;
    return (a.percentage > b.percentage) ? -1 : 1;
  });

  return wordStats;
}

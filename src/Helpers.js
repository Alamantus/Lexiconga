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

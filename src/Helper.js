class Helper {
  constructor () {
    this.addHelpfulPrototypes();
  }

  addHelpfulPrototypes () {
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
    String.prototype.replaceAt = function (index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
  }

  characterIsUppercase (character) {
    return character === character.toUpperCase();
  }

  arraysAreEqual (array1, array2) {
    // if the other array2 is a falsy value, return
    if (!array1 || !array2)
      return false;

    // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
      return false;

    for (var i = 0, l=array1.length; i < l; i++) {
      // Check if we have nested arrays
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!array1[i].equals(array2[i]))
          return false;       
      }           
      else if (array1[i] != array2[i]) { 
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;   
      }           
    }       
    return true;
  }

  objectIsEmpty (obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}

export default new Helper;

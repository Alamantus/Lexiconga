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
}

export default new Helper;

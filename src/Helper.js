class Helper {
  constructor () {
    this.addHelpfulPrototypes();
  }

  addHelpfulPrototypes () {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  getLastLetter (string) {
    return string.substr(string.length - 1, 1);
  }
}

export default new Helper;

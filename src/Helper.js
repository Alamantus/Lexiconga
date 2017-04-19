class Helper {
  constructor () {
    this.addHelpfulPrototypes();
  }

  addHelpfulPrototypes () {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }
}

export default new Helper;

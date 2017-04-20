class IDManager {
  constructor () {
    this['key'] = 0;
    this['word'] = 0;
    // Add IDs here as needed.
  }

  setID (id, value) {
    this[id] = value;
  }

  next (id) {
    return this[id]++;
  }
}

export default new IDManager;
export class IDManager {
  constructor () {
    this.nextId = 0;
  }

  get next () {
    return this.nextId++;
  }

  get nextStr () {
    return this.next.toString();
  }
}
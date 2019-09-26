import {createElement} from './../utils.js';

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element = null;
    }
  }

  addEvent(eventName, callback) {
    this.getElement().addEventListener(eventName, callback);
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }
}

export default AbstractComponent;

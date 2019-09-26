import AbstractComponent from './abstract-component.js';

class TripItemComponent extends AbstractComponent {
  constructor({type, location, startTime, endTime, price, offers, photo, description, isFavorite, dayCounter = null}) {
    super();
    this._element = null;
    this._type = type;
    this._location = location;
    this._startTime = startTime;
    this._endTime = endTime;
    this._price = price;
    this._offers = offers;
    this._dayCounter = dayCounter;
    this._photo = photo;
    this._description = description;
    this._isFavorite = isFavorite;
  }

  renderElement(container) {
    container.append(this.getElement());
  }
}

export default TripItemComponent;

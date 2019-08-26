import {AbstractComponent} from './abstract-component.js';

export class EventItemComponent extends AbstractComponent {
  constructor({type, location, startTime, startTimeEdit, endTime, diffTime, price, offers, photo, description, endTimeEdit, isFavorite, dayCounter = null}) {
    super();
    this._element = null;
    this._type = type;
    this._location = location;
    this._startTime = startTime;
    this._startTimeEdit = startTimeEdit;
    this._endTime = endTime;
    this._diffTime = diffTime;
    this._price = price;
    this._offers = offers;
    this._dayCounter = dayCounter;
    this._photo = photo;
    this._description = description;
    this._endTimeEdit = endTimeEdit;
    this._isFavorite = isFavorite;
  }

  renderElement(container) {
    container.append(this.getElement());
  }
}

import {createElement} from './../utils.js';
import {TripItemEdit} from './trip-edit.js';
import {removeElement, getAddNewEvent} from './../utils.js';

export class TripItem {
  constructor({type, location, startTime, startTimeEdit, endTime, diffTime, price, offers, photo, description, endTimeEdit, isFavorite, dayCounter = null}) {
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
    this._allObj = {type, location, photo, description, startTimeEdit, endTimeEdit, price, offers, isFavorite};
    this._tripEdit = new TripItemEdit(this._allObj);
    this._tripItemContainer = document.querySelector(`.trip-days`);
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

  renderElement(container) {
    container.append(this.getElement());

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        container.replaceChild(this.getElement(), this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.replaceChild(this._tripEdit.getElement(), this.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._tripEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._tripItemContainer.replaceChild(this.getElement(), this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._tripEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        removeElement(this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._tripEdit.removeElement();
        getAddNewEvent();
      });
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._dayCounter !== null ? this._dayCounter : ``}</span>
          <time class="day__date" datetime="">${this._dayCounter !== null ? `${this._startTimeEdit.toLocaleDateString(`en-GB`, {month: `short`})} ${this._startTimeEdit.getDate()}` : ``}</time>
        </div>
        <ul class="trip-events__list">
          <li class="trip-events__item">
            <div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">Check into ${this._location}</h3>

              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="2019-03-18T12:25">${this._startTime}</time>
                  &mdash;
                  <time class="event__end-time" datetime="2019-03-18T13:35">${this._endTime}</time>
                </p>
                <p class="event__duration">${this._diffTime}</p>
              </div>

              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${this._price}</span>
              </p>

              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">

               ${this._offers.filter((offer) => offer.isChecked).map((offer) => `<li class="event__offer">
                 <span class="event__offer-title">${offer.title}</span>
                   &plus;
                   &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
              </li>`).join(``)}
              </ul>

              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>
        </ul>
      </li>
      `;
  }
}

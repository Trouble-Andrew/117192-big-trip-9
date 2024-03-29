import TripItemComponent from './trip-item-component.js';
import {getFormattedTimeDifference, pretext} from './../utils.js';
import moment from 'moment';

class TripItem extends TripItemComponent {
  constructor(params) {
    super(params);
    this._allObj = params;
    this._MAX_OFFERS_COUNT = 3;
  }

  getTemplate() {
    return `<div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pretext(this._type.charAt(0).toUpperCase() + this._type.slice(1))} ${this._location}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${moment(this._startTime).format(`YYYY-MM-DDTHH:MM`)}">${moment(this._startTime).format(`HH:MM`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${moment(this._endTime).format(`YYYY-MM-DDTHH:MM`)}">${moment(this._endTime).format(`HH:MM`)}</time>
          </p>
          <p class="event__duration">${getFormattedTimeDifference(this._startTime, this._endTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">

         ${this._offers.filter((offer) => offer.accepted).map((offer) => `<li class="event__offer">
           <span class="event__offer-title">${offer.title}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`).slice(0, this._MAX_OFFERS_COUNT).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
      `;
  }
}

export default TripItem;

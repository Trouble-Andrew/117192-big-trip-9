import {EventItemComponent} from './trip-item-component.js';
import {TripItemEdit} from './trip-edit.js';
import {diffGetTime, pretext} from './../utils.js';
import moment from 'moment';

export class TripItem extends EventItemComponent {
  constructor(params) {
    super(params);
    this._allObj = params;
    this._tripEdit = new TripItemEdit(this._allObj);
    this._tripItemContainer = document.querySelector(`.trip-days`);
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
          <p class="event__duration">${diffGetTime(this._startTime, this._endTime)}</p>
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
      `;
  }
}

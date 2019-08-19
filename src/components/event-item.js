import {sortedMockArray} from './../main.js';

export const getEventItemTemplate = ({type, location, startTime, startTimeEdit, endTime, diffTime, price, offers}) => `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">Check into ${location}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T12:25">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T13:35">${endTime}</time>
        </p>
        <p class="event__duration">${diffTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">

       ${offers.filter((offer) => offer.isChecked).map((offer) => `<li class="event__offer">
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
  `;

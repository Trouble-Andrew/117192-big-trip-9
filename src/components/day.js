import AbstractComponent from './abstract-component.js';
import moment from 'moment';

class Day extends AbstractComponent {
  constructor(dueDate, itemsCount, dayCounter) {
    super(dueDate, itemsCount);
    this._startTime = dueDate;
    this._itemsCount = itemsCount;
    this._dayCounter = dayCounter;
  }

  _getDays() {
    let markup = ``;
    for (let i = 0; i < this._itemsCount; i++) {
      markup += `<li class="trip-events__item"></li>`;
    }
    return markup;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._dayCounter !== 0 ? this._dayCounter : ``}</span>
          <time class="day__date" datetime="${moment(this._startTime).format(`YYYY-MM-DD`)}">${this._dayCounter !== 0 ? moment(this._startTime).format(`D MMM`) : ``}</time>
        </div>
        <ul class="trip-events__list">
          ${this._getDays()}
        </ul>
      </li>`;
  }
}

export default Day;

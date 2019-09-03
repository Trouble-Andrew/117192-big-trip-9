import {AbstractComponent} from './abstract-component.js';

export class Day extends AbstractComponent {
  constructor(dueDate, itemsCount) {
    super(dueDate, itemsCount);
    this._startTime = dueDate;
    this._itemsCount = itemsCount;
  }

  getDays() {
    let markup = ``;
    for (let i = 0; i < this._itemsCount; i++) {
      markup += `<li class="trip-events__item"></li>`;
    }
    return markup;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">1</span>
          <time class="day__date" datetime="2019-03-18">${new Date(this._startTime).toLocaleDateString(`en-GB`, {month: `short`})} ${new Date(this._startTime).getDate()}</time>
        </div>
        <ul class="trip-events__list">
          ${this.getDays()}
        </ul>
      </li>`;
  }
}

import {removeElement, getAddNewEvent} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';

export class TripController {
  constructor(container, tripItems) {
    this._container = container;
    this._tripItems = tripItems;
    this._dayCounter = 1;
    this._currentDay = this._tripItems[0].startTimeEdit.getDate();
  }

  init() {
    this._tripItems[0].dayCounter = this._dayCounter;
    this._renderTripItem(this._tripItems[0]);

    for (let i = 1; i < this._tripItems.length; i++) {
      if (this._currentDay !== this._tripItems[i].startTimeEdit.getDate()) {
        this._dayCounter += 1;
        this._tripItems[i].dayCounter = this._dayCounter;
        this._renderTripItem(this._tripItems[i]);
      } else {
        this._renderTripItem(this._tripItems[i]);
      }
    }
  }

  _renderTripItem(arrayMock) {
    const tripItem = new TripItem(arrayMock);
    const tripEdit = new TripItemEdit(arrayMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(tripItem.getElement(), tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    tripItem.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._container.replaceChild(tripEdit.getElement(), tripItem.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });
    //
    tripEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._container.replaceChild(tripItem.getElement(), tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    tripEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        removeElement(tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
        tripEdit.removeElement();
        getAddNewEvent();
      });

    tripItem.renderElement(this._container);
  }
}

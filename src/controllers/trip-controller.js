import {removeElement, getAddNewEvent, render, unrender, Position} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import {Sort} from './../components/sort.js';

export class TripController {
  constructor(container, tripItems) {
    this._container = container;
    this._tripItems = tripItems;
    this._sort = new Sort();
    this._dayCounter = 1;
    this._currentDay = new Date(this._tripItems[0].startTime).getDate();
  }

  init() {
    this._renderDays(this._tripItems);
    this._sort.getElement()
    .addEventListener(`click`, (evt) => this._sortLinkHandler(evt));
  }

  _renderDays(itemArray) {
    let allItems = document.querySelectorAll(`.trip-days__item`);
    unrender(this._sort.getElement());
    allItems.forEach((item) => unrender(item));
    this._dayCounter = 1;
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    itemArray[0].dayCounter = this._dayCounter;
    this._renderTripItem(itemArray[0]);

    for (let i = 1; i < itemArray.length; i++) {
      if (this._currentDay !== new Date(itemArray[i].startTime).getDate()) {
        this._dayCounter = new Date(itemArray[i].startTime).getDate() - this._currentDay;
        itemArray[i].dayCounter = this._dayCounter;
        this._renderTripItem(itemArray[i]);
      } else {
        this._renderTripItem(itemArray[i]);
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
  _sortLinkHandler(evt) {
    switch (evt.target.htmlFor) {
      case `sort-event`:
        this._renderDays(this._tripItems);
        break;
      case `sort-time`:
        const sortedByDate = this._tripItems.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));

        this._renderDays(sortedByDate);
        break;
      case `sort-price`:
        const sortedByPrice = this._tripItems.slice().sort((a, b) => b.price - a.price);
        this._renderDays(sortedByPrice);
        break;
    }
  }
}

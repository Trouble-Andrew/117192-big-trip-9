import {removeElement, getAddNewEvent, render, unrender, Position} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import {Day} from './../components/day.js';
import {Sort} from './../components/sort.js';
import {PointController} from './point-controller.js';

export class TripController {
  constructor(container, tripItems) {
    this._tripItems = tripItems;
    this._container = container;
    this._sort = new Sort();
    this._onDataChange = this._onDataChange.bind(this);
    // this._dayCounter = 1;
    // this._currentDay = new Date(this._tripItems[0].startTime).getDate();
  }

  init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    // this._sort.getElement();
    // .addEventListener(`click`, (evt) => this._sortLinkHandler(evt));
    // let dayContainer = this._container.querySelector(`.`)
    // this._tripItems.forEach((taskMock) => this._renderTrip(taskMock));
    console.log(this._container);
    this._renderTrip(this._tripItems)
  }

  _renderTrip(task) {
    const pointController = new PointController(this._container, task);
    console.log(pointController);
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

  _onDataChange(newData, oldData) {
    this._tripItems[this._tripItems.findIndex((it) => it === oldData)] = newData;
    // this._renderBoard(this._tripItems);
  }

}

import {render, unrender, Position} from './../utils.js';
import {Day} from './../components/day.js';
import {Sort} from './../components/sort.js';
import {PointController} from './point-controller.js';

export class TripController {
  constructor(container, tripItems) {
    this._tripItems = tripItems;
    this._container = container;
    this._sort = new Sort();
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
  }

  init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    this._renderDays(this._tripItems);
    this._sort.getElement()
			.addEventListener(`click`, (evt) => this._sortLinkHandler(evt));

  }

  _renderDays(itemArray) {
    this._underderContainer();
    let daysContainer = document.querySelector(`.trip-days`);
    let index = 0;
    const allDates = this._findDates(this._tripItems);
    allDates.forEach((day) => {
      let days = this._tripItems.filter((obj) => new Date(obj.startTime).getDate() === day);
      let dayElement = new Day(days[0].startTime, days.length);
      render(daysContainer, dayElement.getElement(), Position.BEFOREEND);
      let tripDaysContainer = dayElement.getElement().querySelectorAll(`.trip-events__item`);
      Array.from(tripDaysContainer).forEach((dayContainer) => {
        let pointController = new PointController(dayContainer, itemArray[index], this._onDataChange, this._onChangeView);
        index += 1;
        this._subscriptions.push(pointController.setDefaultView.bind(pointController));
      });
    });
  }

  _underderContainer() {
    let containerChilds = this._container.querySelectorAll(`.trip-days__item`);
    containerChilds.forEach((item) => unrender(item));
  }

  _findDates(itemArray) {
    let allDates = new Set([]);
    itemArray.forEach(function (item) {
      allDates.add(new Date(item.startTime).getDate());
    });
    return Array.from(allDates);
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

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._tripItems[this._tripItems.findIndex((it) => it === oldData)] = newData;
    this._renderDays(this._tripItems);
  }
}

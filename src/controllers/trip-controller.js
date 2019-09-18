import {render, unrender, Position} from './../utils.js';
import {Day} from './../components/day.js';
import {Sort} from './../components/sort.js';
import {Mode as PointControllerMode, PointController} from './point-controller.js';
import {DaysController} from './days-controller.js';

export class TripController {
  constructor(container, onDataChange) {
    this._points = [];
    this._container = container;
    this._sort = new Sort();
    this._onDataChangeMain = onDataChange;
    this._statisticController = null;
    this._subscriptions = [];

    this._daysController = new DaysController(this._container, this._onDataChange.bind(this));

    this._init();
  }

  _init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    this._sort.getElement()
			.addEventListener(`click`, (evt) => this._sortLinkHandler(evt));

  }

  _renderTrip() {
    this._daysController.setPoints(this._points);
  }

  show(points) {
    if (points !== this._points) {
      this._setPoints(points);
    }

    this._container.classList.remove(`visually-hidden`);
  }

  _setPoints(points) {
    this._points = points;
    this._renderTrip();
  }

  _renderForSort(itemArray) {

    this._underderContainer();
    let daysContainer = document.querySelector(`.trip-days`);
    let index = 0;
    let dayCounter = 0;
    const allDates = this._findDates(itemArray);

    allDates.forEach((day) => {
      let days = itemArray.filter((obj) => new Date(obj.startTime).getDate() === day);
      let dayElement = new Day(days[0].startTime, days.length, dayCounter);
      render(daysContainer, dayElement.getElement(), Position.BEFOREEND);
      let tripDaysContainer = dayElement.getElement().querySelectorAll(`.trip-events__item`);
      Array.from(tripDaysContainer).forEach((dayContainer) => {
        let pointController = new PointController(dayContainer, itemArray[index], PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
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
        this._renderTrip();
        break;
      case `sort-time`:
        const sortedByDate = this._points.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
        this._renderForSort(sortedByDate);
        break;
      case `sort-price`:
        const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
        this._renderForSort(sortedByPrice);
        break;
    }
  }

  _onDataChange(points) {
    this._points = points;
    this._onDataChangeMain(this._points);
    this._renderTrip();
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  createPoint() {
    this._daysController.createPoint();
  }
}

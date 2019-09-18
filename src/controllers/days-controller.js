import {render, unrender, Position, sortArrayOfObjByDate} from './../utils.js';
import {Day} from './../components/day.js';
import {Mode as PointControllerMode, PointController} from './point-controller.js';
import moment from 'moment';

export class DaysController {
  constructor(container, onDataChange) {
    this._points = [];
    this._container = container;
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onDataChangeMain = onDataChange;
    this._subscriptions = [];
    this._creatingPoint = null;
  }

  setPoints(points) {
    this._points = points;
    this._subscriptions = [];
    // this._container.innerHTML = ``;
    this._renderDays(sortArrayOfObjByDate(points));
  }

  _showDays(prevDate, nextDate) {
    const start = moment(nextDate);
    let end = 0;
    end = prevDate === 0 ? end = moment(nextDate) : end = moment(prevDate);
    const diff = start.diff(end, `days`) === 0 ? 1 : start.diff(end, `days`);
    return diff;
  }

  _renderDays(itemArray) {

    this._underderContainer();
    itemArray = sortArrayOfObjByDate(itemArray);
    let daysContainer = document.querySelector(`.trip-days`);
    let index = 0;
    let dayCounter = 0;
    let previousDate = 0;
    const allDates = this._findDates(itemArray);

    allDates.forEach((day) => {
      let days = itemArray.filter((obj) => new Date(obj.startTime).getDate() === day);
      dayCounter += this._showDays(previousDate, days[0].startTime);
      let dayElement = new Day(days[0].startTime, days.length, dayCounter);
      previousDate = previousDate === 0 ? days[0].startTime : previousDate;
      previousDate = days[0].startTime;
      render(daysContainer, dayElement.getElement(), Position.BEFOREEND);
      let tripDaysContainer = dayElement.getElement().querySelectorAll(`.trip-events__item`);
      Array.from(tripDaysContainer).forEach((dayContainer) => {
        let pointController = new PointController(dayContainer, itemArray[index], PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
        index += 1;
        this._subscriptions.push(pointController.setDefaultView.bind(pointController));
      });
    });
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

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    const index = this._points.findIndex((item) => item === oldData);
    if (newData === null) {
      this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];
    } else if (oldData === null) {
      this._creatingPoint = null;
      this._points = [newData, ...this._points];
    } else {
      this._points[index] = newData;
    }

    this.setPoints(this._points);

    this._onDataChangeMain(this._points);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const defaultPoint = {
      type: `bus`,
      location: ``,
      photo: `http://picsum.photos/300/150?r=${Math.random()}`,
      description: ``,
      startTime: new Date(),
      endTime: new Date(),
      price: 0,
      offers: [
        {
          title: `Add luggage`,
          price: Math.floor(Math.random() * 50) + 5,
          isChecked: false,
        },
        {
          title: `Switch to comfort class`,
          price: Math.floor(Math.random() * 200) + 50,
          isChecked: false,
        },
        {
          title: `Add meal`,
          price: Math.floor(Math.random() * 10) + 1,
          isChecked: false,
        },
        {
          title: `Choose seats`,
          price: Math.floor(Math.random() * 50) + 1,
          isChecked: false,
        },
      ],
      isFavorite: false,
    };
    this._creatingPoint = new PointController(this._container.querySelector(`.trip-days`), defaultPoint, PointControllerMode.ADDING, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    }, this._onChangeView);
    if (this._container.querySelector(`.event--edit`) === null) {
      this._creatingTask = null;
    }
  }
}
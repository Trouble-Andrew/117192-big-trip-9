import {render, unrender, Position, sortArrayOfObjByDate} from './../utils.js';
import {Day} from './../components/day.js';
import {Sort} from './../components/sort.js';
import {Mode as PointControllerMode, PointController} from './point-controller.js';
import moment from 'moment';

export class TripController {
  constructor(container, tripItems, onDataChange, types, destinations) {
    this._tripItems = tripItems;
    this._container = container;
    this._sort = new Sort();
    this._tripTypes = types;
    this._destinations = destinations;
    this._onDataChangeMain = onDataChange;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
    this._creatingPoint = null;
  }

  init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    this.renderDays(sortArrayOfObjByDate(this._tripItems));
    this._sort.getElement()
			.addEventListener(`click`, (evt) => this._sortLinkHandler(evt));
  }

  _showDays(prevDate, nextDate) {
    const start = moment(nextDate);
    let end = 0;
    end = prevDate === 0 ? end = moment(nextDate) : end = moment(prevDate);
    const diff = start.diff(end, `days`) === 0 ? 1 : start.diff(end, `days`);
    return diff;
  }

  renderDays(itemArray) {

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
        let pointController = new PointController(dayContainer, itemArray[index], PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView, this._tripTypes, this._destinations);
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
        let pointController = new PointController(dayContainer, itemArray[index], PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView, this._tripTypes, this._destinations);
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
        this.renderDays(this._tripItems);
        break;
      case `sort-time`:
        const sortedByDate = this._tripItems.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
        this._renderForSort(sortedByDate);
        break;
      case `sort-price`:
        const sortedByPrice = this._tripItems.slice().sort((a, b) => b.price - a.price);
        this._renderForSort(sortedByPrice);
        break;
    }
  }

  _onChangeView() {
    const allPoints = this._container.querySelectorAll(`.trip-events__item`);
    this._subscriptions.forEach((subscription) => subscription());

    if (allPoints.length > this._tripItems.length) {
      unrender(allPoints[0]);
      this._creatingPoint = null;
    }
  }

  _onDataChange(actionType, update, onError) {
    this._creatingPoint = null;
    this._onDataChangeMain(actionType, update, onError);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show(trips) {
    if (trips !== this._tripItems) {
      this._setPoints(sortArrayOfObjByDate(trips));
    }

    this._container.classList.remove(`visually-hidden`);
  }

  _setPoints(points) {
    this._tripItems = points;
    this.renderDays(this._tripItems);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const defaultPoint = {
      type: `bus`,
      location: ``,
      photo: [],
      description: ``,
      startTime: new Date(),
      endTime: new Date(),
      price: 0,
      offers: [],
      isFavorite: false,
    };

    this._onChangeView();

    this._creatingPoint = new PointController(this._container.querySelector(`.trip-days`), defaultPoint, PointControllerMode.ADDING, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    }, this.onChangeView, this._tripTypes, this._destinations);

    if (this._container.querySelector(`.event--edit`) === null) {
      this._creatingTask = null;
    }

  }
}


// import {render, unrender, Position, sortArrayOfObjByDate, getAddNewEvent} from './../utils.js';
// import {Day} from './../components/day.js';
// import {Sort} from './../components/sort.js';
// import {Mode as PointControllerMode, PointController} from './point-controller.js';
// // import {PointController} from './days-controller.js';
//
// export class TripController {
//   constructor(container, points, onDataChange, types, destinations) {
//     this._points = sortArrayOfObjByDate(points);
//     this._tripTypes = types;
//     this._destinations = destinations;
//     this._container = container;
//     this._sort = new Sort();
//     this._onDataChangeMain = onDataChange;
//     this._statisticController = null;
//     this._subscriptions = [];
//
//     this._PointController = new PointController(this._container, this._onDataChange.bind(this), this._tripTypes, this._destinations);
//
//     this.init();
//   }
//
//   init() {
//     if (this._points.length === 0) {
//       getAddNewEvent();
//       return;
//     }
//
//     render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
//     this._sort.getElement()
// 			.addEventListener(`click`, (evt) => this._sortLinkHandler(evt));
//     this.renderTrip();
//   }
//
//   renderTrip() {
//     if (this._points.length === 0) {
//       getAddNewEvent();
//       return;
//     }
//     this._PointController.setPoints(this._points);
//   }
//
//   show(points) {
//     if (points !== this._points) {
//       this._setPoints(sortArrayOfObjByDate(points));
//     }
//
//     this._container.classList.remove(`visually-hidden`);
//   }
//
//   _setPoints(points) {
//     this._points = points;
//     this.renderTrip();
//   }
//
//   _renderForSort(itemArray) {
//
//     this._underderContainer();
//     let daysContainer = document.querySelector(`.trip-days`);
//     let index = 0;
//     let dayCounter = 0;
//     const allDates = this._findDates(itemArray);
//
//     allDates.forEach((day) => {
//       let days = itemArray.filter((obj) => new Date(obj.startTime).getDate() === day);
//       let dayElement = new Day(days[0].startTime, days.length, dayCounter);
//       render(daysContainer, dayElement.getElement(), Position.BEFOREEND);
//       let tripDaysContainer = dayElement.getElement().querySelectorAll(`.trip-events__item`);
//       Array.from(tripDaysContainer).forEach((dayContainer) => {
//         let pointController = new PointController(dayContainer, itemArray[index], PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView, this._tripTypes, this._destinations);
//         index += 1;
//         this._subscriptions.push(pointController.setDefaultView.bind(pointController));
//       });
//     });
//   }
//
//   _underderContainer() {
//     let containerChilds = this._container.querySelectorAll(`.trip-days__item`);
//     containerChilds.forEach((item) => unrender(item));
//   }
//
//   _findDates(itemArray) {
//     let allDates = new Set([]);
//     itemArray.forEach(function (item) {
//       allDates.add(new Date(item.startTime).getDate());
//     });
//     return Array.from(allDates);
//   }
//
//   _sortLinkHandler(evt) {
//     switch (evt.target.htmlFor) {
//       case `sort-event`:
//         this.renderTrip();
//         break;
//       case `sort-time`:
//         const sortedByDate = this._points.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
//         this._renderForSort(sortedByDate);
//         break;
//       case `sort-price`:
//         const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
//         this._renderForSort(sortedByPrice);
//         break;
//     }
//   }
//
//   _onDataChange(points) {
//     this._points = points;
//     this._onDataChangeMain(this._points);
//     this.renderTrip();
//   }
//
//   hide() {
//     this._container.classList.add(`visually-hidden`);
//   }
//
//   createPoint() {
//     this._PointController.createPoint();
//   }
// }

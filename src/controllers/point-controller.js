import {removeElement, getAddNewEvent, render, unrender, Position} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import {Sort} from './../components/sort.js';
import {Day} from './../components/day.js';
import flatpickr from 'flatpickr';

export class PointController {
  constructor(container, data) {
    this._container = container;
    this._data = data;
    // this._onDataChange = onDataChange;
    this._tripItem = new TripItem(data);
    this._tripEdit = new TripItemEdit(data);
    // this._sort = new Sort();
    this._dayCounter = 1;
    this._currentDay = new Date(this._data[0].startTime).getDate();
  }

  init() {
    // this._renderDays(this._data);
    // this._sort.getElement()
    // .addEventListener(`click`, (evt) => this._sortLinkHandler(evt));

  }

  // _renderDays(itemArray) {
  //   let allItems = document.querySelectorAll(`.trip-days__item`);
  //   unrender(this._sort.getElement());
  //   allItems.forEach((item) => unrender(item));
  //   this._dayCounter = 1;
  //   render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
  //   itemArray[0].dayCounter = this._dayCounter;
  //   this._renderTripItem(itemArray[0]);
  //
  //   for (let i = 1; i < itemArray.length; i++) {
  //     if (this._currentDay !== new Date(itemArray[i].startTime).getDate()) {
  //       this._dayCounter += 1;
  //       itemArray[i].dayCounter = this._dayCounter;
  //       this._renderTripItem(itemArray[i]);
  //     } else {
  //       this._renderTripItem(itemArray[i]);
  //     }
  //   }
  // }

  _underderContainer() {
    let containerChilds = this._container.querySelectorAll(`.trip-days__item`);
    containerChilds.forEach((item) => unrender(item));
  }

  _renderDays(itemArray) {
    this._underderContainer();

    const allDates = this._findDates(itemArray);
    let index = 0;
    allDates.forEach((item) => {
      let days = itemArray.filter((obj) => new Date(obj.startTime).getDate() === item);
      let day = new Day(days[0].startTime, days.length);
      render(this._container, day.getElement(), Position.BEFOREEND);
      let tripDaysContainer = day.getElement().querySelectorAll(`.trip-events__item`);
      Array.from(tripDaysContainer).forEach((dayContainer) => {
        this._renderTripItem(itemArray[index], dayContainer);
        index += 1;
      });

    });
  }

  _findDates(itemArray) {
    let allDates = new Set([]);
    itemArray.forEach(function (item) {
      allDates.add(new Date(item.startTime).getDate());
    });
    return Array.from(allDates);
  }

  _renderTripItem(arrayMock, container) {
    // const tripItem = new TripItem(arrayMock);
    // const tripEdit = new TripItemEdit(arrayMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    flatpickr(this._tripEdit.getElement().querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: arrayMock.startTime,
    });
    flatpickr(this._tripEdit.getElement().querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: arrayMock.endTime,
    });

    this._tripEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const formData = new FormData(this._tripEdit.getElement());
        // let dateSwitch = this._cardEdit.getElement().querySelector(`.card__date-status`).innerHTML === `yes` ? true : false;
        // let dateField = dateSwitch === true ? new Date(formData.get(`date`)) : null;
        const entry = {
          type: formData.get(`event-type`),
          location: formData.get(`event-destination`),
          price: formData.get(`event-price`),
          startTime: formData.get(`event-start-time`),
          endTime: formData.get(`event-start-time`),
          isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
          offers: [
            {
              title: `Add luggage`,
              price: Math.floor(Math.random() * 50) + 5,
              isChecked: formData.get(`event-offer-luggage`) === `on` ? true : false,
            },
            {
              title: `Switch to comfort class`,
              price: Math.floor(Math.random() * 200) + 50,
              isChecked: formData.get(`event-offer-comfort`) === `on` ? true : false,
            },
            {
              title: `Add meal`,
              price: Math.floor(Math.random() * 10) + 1,
              isChecked: formData.get(`event-offer-meal`) === `on` ? true : false,
            },
            {
              title: `Choose seats`,
              price: Math.floor(Math.random() * 50) + 1,
              isChecked: formData.get(`event-offer-seats`) === `on` ? true : false,
            },
          ],
        };
        // this._onDataChange(entry, this._data);
        this._data[this._data.findIndex((it) => it === arrayMock)] = entry;

        this._renderDays(this._data);
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    this._tripItem.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.replaceChild(this._tripEdit.getElement(), this._tripItem.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._tripEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._tripEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        removeElement(this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._tripEdit.removeElement();
        getAddNewEvent();
      });

    this._tripItem.renderElement(container);
  }
}

import {removeElement, getAddNewEvent} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import flatpickr from 'flatpickr';

export class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripItem = new TripItem(data);
    this._tripEdit = new TripItemEdit(data);

    this.init();
  }

  init() {
    this._renderTripItem(this._data, this._container);
  }

  setDefaultView() {
    if (this._container.contains(this._tripEdit.getElement())) {
      this._container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
    }
  }

  _renderTripItem(arrayMock, container) {

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
        const description = this._tripEdit.getElement().querySelector(`.event__destination-description`).innerHTML;
        const photo = this._tripEdit.getElement().querySelector(`.event__photo`).src;
        const formData = new FormData(this._tripEdit.getElement());
        const entry = {
          type: formData.get(`event-type`),
          description,
          photo,
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
        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    this._tripItem.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
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
        this._tripItem.removeElement();
        getAddNewEvent();
        this._checkDays();
      });

    this._tripItem.renderElement(container);
  }

  _checkDays() {
    let allDays = document.querySelectorAll(`.trip-days__item`);
    Array.from(allDays).forEach((day) => {
      if (Array.from(day.querySelectorAll(`.event`)).length === 0) {
        removeElement(day);
      }
    });
  }
}

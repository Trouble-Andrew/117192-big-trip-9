import {removeElement, Position} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import {render} from './../utils.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripItem = new TripItem(data);
    this._mode = mode;
    this._tripEdit = new TripItemEdit(data, mode);

    this.create(this._mode);
  }

  create(mode) {
    this._renderTripItem(this._data, this._container, mode);
  }

  setDefaultView() {
    if (this._container.contains(this._tripEdit.getElement())) {
      this._container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
    }
  }

  _renderTripItem(arrayMock, container, mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._tripItem;

    if (mode === Mode.ADDING) {
      renderPosition = Position.BEFORE;
      currentView = this._tripEdit;
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (mode === Mode.DEFAULT) {
          if (container.contains(this._tripEdit.getElement())) {
            container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
          }
        } else if (mode === Mode.ADDING) {
          container.removeChild(currentView.getElement());
        }

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
          price: Number.isInteger(Number.parseInt(formData.get(`event-price`), 0)) === true ? Number.parseInt(formData.get(`event-price`), 0) : 0,
          startTime: Number.parseInt((moment(new Date(formData.get(`event-start-time`))).unix() + `000`), 0),
          endTime: Number.parseInt((moment(new Date(formData.get(`event-end-time`))).unix() + `000`), 0),
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
        this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    this._tripItem.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        container.replaceChild(this._tripEdit.getElement(), this._tripItem.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    if (this._mode === `default`) {
      this._tripEdit.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

      this._tripEdit.getElement()
        .querySelector(`.event__reset-btn`)
        .addEventListener(`click`, () => {
          this._onDataChange(null, this._data);
        });
    }

    if (this._mode === `adding`) {
      this._tripEdit.getElement()
        .querySelector(`.event__reset-btn`)
        .addEventListener(`click`, () => {
          removeElement(this._tripEdit.getElement());
        });

      this._tripEdit.getElement()
        .querySelector(`.event__save-btn`)
        .addEventListener(`click`, () => {
          removeElement(this._tripEdit.getElement());
        });
    }
    render(container, currentView.getElement(), renderPosition);
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

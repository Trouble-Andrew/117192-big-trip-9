import {removeElement, Position} from './../utils.js';
import {TripItem} from './../components/event-item.js';
import {TripItemEdit} from './../components/trip-edit.js';
import {render, unrender} from './../utils.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const ON_DATA_CHANGE_DELAY = 1000;

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView, types, destinations) {
    this._container = container !== null ? container : document.querySelector(`.trip-events`);
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripItem = new TripItem(data, types, destinations);
    this._tripTypes = types;
    this._destinations = destinations;
    this._mode = mode;
    this._tripEdit = new TripItemEdit(data, mode, types, destinations);

    this.create(this._mode);
  }

  create(mode) {
    this._renderTripItem(this._data, this._container, mode);
  }

  setDefaultView() {
    if (this._container.contains(this._tripEdit.getElement())) {
      this._container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
      this._tripEdit.resetForm();
    }
  }

  _renderTripItem(data, container, mode) {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (this._tripEdit.getElement().parentNode === this._container) {
          this._tripEdit.resetForm();
          this._container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
        }

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }
    };
    let renderPosition = Position.BEFOREEND;
    let currentView = this._tripItem;

    if (mode === Mode.ADDING) {
      renderPosition = Position.BEFORE;
      currentView = this._tripEdit;
      unrender(document.querySelector(`.trip-events__msg`));
    }

    flatpickr(this._tripEdit.getElement().querySelector(`#event-start-time-1`), {
      allowInput: false,
      defaultDate: moment(data.startTime).format(`DD/MM/YY HH:mm`),
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      onChange(selectedDates) {
        if (moment(selectedDates[0]).valueOf() > moment(document.querySelector(`#event-end-time-1`).value, `DD/MM/YY HH:mm`).valueOf()) {
          document.querySelector(`#event-end-time-1`).value = moment(selectedDates[0]).format(`DD/MM/YY HH:mm`);
        }
      },
    });

    flatpickr(this._tripEdit.getElement().querySelector(`#event-end-time-1`), {
      allowInput: false,
      defaultDate: moment(data.endTime).format(`DD/MM/YY HH:mm`),
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      onChange(selectedDates) {
        if (moment(selectedDates[0]).valueOf() < moment(document.querySelector(`#event-start-time-1`).value, `DD/MM/YY HH:mm`).valueOf()) {
          document.querySelector(`#event-start-time-1`).value = moment(selectedDates[0]).format(`DD/MM/YY HH:mm`);
        }
      },
    });

    this._tripEdit.getElement()
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const entry = this._buildNewData();

        this.blockForm(`save`, true);
        setTimeout(this._onDataChange.bind(this,
            mode === Mode.DEFAULT ? `update` : `create`,
            entry,
            () => {
              this.onErrorDataChange();
            }),
        ON_DATA_CHANGE_DELAY);

        document.removeEventListener(`keydown`, this._onEscKeyDown);
        unrender(document.querySelector(`.event--edit`));
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
        if (this._mode === Mode.ADDING) {
          unrender(this._tripEdit.getElement());
          this._tripEdit.removeElement();
          this._onDataChange(null, null);
        } else if (this._mode === Mode.DEFAULT) {
          this._tripEdit.resetForm();
          container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      });

    this._tripEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._tripEdit.resetForm();
        container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    if (this._mode === Mode.DEFAULT) {
      // this._tripEdit.getElement()
      //   .querySelector(`.event__rollup-btn`)
      //   .addEventListener(`click`, () => {
      //     this._tripEdit.resetForm();
      //     container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
      //     document.removeEventListener(`keydown`, onEscKeyDown);
      //   });

      // this._tripEdit.getElement()
      //   .querySelector(`.event__reset-btn`)
      //   .addEventListener(`click`, () => {
      //     this._onDataChange(null, this._data);
      //   });
      // this._tripEdit.getElement()
      // .querySelector(`.event__reset-btn`)
      // .addEventListener(`click`, (evt) => {
      //   evt.preventDefault();
      //
      //   this.blockForm(`delete`, true);
      //
      //   if (mode === Mode.ADDING) {
      //     unrender(this._tripEdit.getElement());
      //     this._tripEdit.removeElement();
      //     this._onDataChange(null, null);
      //   } else if (mode === Mode.DEFAULT) {
      //     setTimeout(this._onDataChange.bind(this, `delete`, this._data), ON_DATA_CHANGE_DELAY);
      //   }
      //   document.removeEventListener(`keydown`, this._onEscKeyDown);
      // });
    }

    // this._tripEdit.getElement()
    //   .querySelector(`.event__reset-btn`)
    //   .addEventListener(`click`, () => {
    //     removeElement(this._tripEdit.getElement());
    //     document.removeEventListener(`keydown`, onEscKeyDown);
    //     this._tripEdit.removeElement();
    //     this._tripItem.removeElement();
    //     getAddNewEvent();
    //     this._checkDays();
    //   });

    this._tripEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        this.blockForm(`delete`, true);
        if (this._mode === Mode.ADDING) {
          unrender(this._tripEdit.getElement());
          this._tripEdit.removeElement();
          this._onDataChange(null, null);
        } else if (this._mode === Mode.DEFAULT) {
          setTimeout(this._onDataChange.bind(this, `delete`, this._data), ON_DATA_CHANGE_DELAY);
        }
      });
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

  _buildNewData() {
    const pointId = this._tripEdit.getElement().id;
    const formData = new FormData(this._tripEdit.getElement());
    const pointImages = Array.from(this._tripEdit.getElement().querySelectorAll(`.event__photo`)).map((img) => ({
      src: img.src,
      description: img.alt
    }));
    const pointDescription = this._tripEdit.getElement().querySelector(`.event__destination-description`).textContent;
    const timeFrom = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf();
    const timeTo = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf();
    const pointOffers = Array.from(this._tripEdit.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => {
      return ({
        title: offer.querySelector(`.event__offer-title`).textContent,
        price: Number(offer.querySelector(`.event__offer-price`).textContent),
        accepted: offer.querySelector(`.event__offer-checkbox`).checked
      });
    });

    const entry = {
      id: pointId,
      type: {
        value: formData.get(`event-type`),
        placeholder: `to`
      },
      destination: {
        name: formData.get(`event-destination`),
        description: pointDescription,
        pictures: pointImages,
      },
      startTime: timeFrom,
      endTime: timeTo,
      price: Number(formData.get(`event-price`)),
      isFavorite: Boolean(formData.get(`event-favorite`)),
      offers: pointOffers,
      toRAW() {
        return {
          'id': this.id,
          'type': this.type.value,
          'destination': this.destination,
          'date_from': this.startTime,
          'date_to': this.endTime,
          'base_price': this.price,
          'is_favorite': this.isFavorite,
          'offers': this.offers
        };
      }
    };

    return entry;
  }

  blockForm(btnValue, isDisabled) {
    const buttonSave = this._tripEdit.getElement().querySelector(`.event__save-btn`);
    const buttonDelete = this._tripEdit.getElement().querySelector(`.event__reset-btn`);

    const setDisabledValue = (elem, selector) => {
      elem.querySelectorAll(selector).forEach((input) => {
        input.disabled = isDisabled;
      });
    };

    this._tripEdit.getElement().style.boxShadow = ``;

    this._tripEdit.getElement().querySelector(`.event__type-toggle`).disabled = isDisabled;
    this._tripEdit.getElement().querySelector(`.event__favorite-checkbox`).disabled = isDisabled;
    setDisabledValue(this._tripEdit.getElement(), `.event__input`);
    setDisabledValue(this._tripEdit.getElement(), `.event__offer-checkbox`);
    buttonSave.disabled = isDisabled;
    buttonDelete.disabled = isDisabled;

    if (isDisabled) {
      if (btnValue === `save`) {
        buttonSave.textContent = `Saving...`;
      } else {
        buttonDelete.textContent = `Deleting...`;
      }
    } else {
      buttonSave.textContent = `Save`;
      buttonDelete.textContent = `Delete`;
    }
  }
}

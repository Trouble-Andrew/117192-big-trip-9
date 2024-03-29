import {render, unrender, Position, Mode} from './../utils.js';
import TripItem from './../components/event-item.js';
import TripEdit from './../components/trip-edit.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const ON_DATA_CHANGE_DELAY = 1000;

class PointController {
  constructor(container, data, mode, onDataChange, onChangeView, types, destinations) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._point = new TripItem(data, types, destinations);
    this._tripTypes = types;
    this._destinations = destinations;
    this._mode = mode;
    this._tripEdit = new TripEdit(data, mode, types, destinations);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this.create(this._mode);
  }

  create(mode) {
    this._renderPoint(this._data, this._container, mode);
  }

  setDefaultView() {
    if (this._container.contains(this._tripEdit.getElement())) {
      this._container.replaceChild(this._point.getElement(), this._tripEdit.getElement());
      this._tripEdit.resetForm();
    }
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._container.contains(this._tripEdit.getElement())) {
        this._tripEdit.resetForm();
        this._container.replaceChild(this._point.getElement(), this._tripEdit.getElement());
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _renderPoint(data, container, mode) {

    let renderPosition = Position.BEFOREEND;
    let currentView = this._point;

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
              this._onErrorDataChange();
            }),
        ON_DATA_CHANGE_DELAY);

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    this._point.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        const editField = document.querySelector(`#undefined`);
        unrender(editField);

        this._onChangeView();
        container.replaceChild(this._tripEdit.getElement(), this._point.getElement());
        document.addEventListener(`keydown`, this._onEscKeyDown);
      });

    if (this._mode === Mode.DEFAULT) {
      this._tripEdit.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._tripEdit.resetForm();
          container.replaceChild(this._point.getElement(), this._tripEdit.getElement());
          document.removeEventListener(`keydown`, this._onEscKeyDown);
        });
    }

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
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });
    render(container, currentView.getElement(), renderPosition);
  }

  _checkDays() {
    const allDays = document.querySelectorAll(`.trip-days__item`);
    Array.from(allDays).forEach((day) => {
      if (Array.from(day.querySelectorAll(`.event`)).length === 0) {
        unrender(day);
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

  _shakeTask() {
    const ANIMATION_TIMEOUT = 600;
    const editEventElement = this._tripEdit.getElement();
    editEventElement.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      editEventElement.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _onErrorDataChange() {
    this._shakeTask();
    this.blockForm(null, false);
    this._tripEdit.getElement().style.boxShadow = `0 0 10px 0 red`;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}

export default PointController;

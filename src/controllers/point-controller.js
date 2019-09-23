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

const ON_DATA_CHANGE_DELAY = 1000;

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView, types, destinations) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripItem = new TripItem(data, types, destinations);
    this._tripTypes = types;
    this._destinations = destinations;
    this._mode = mode;
    // this._tripEdit = new TripItemEdit(data, mode, types, destinations);

    this.create(this._mode);
  }

  create(mode) {
    console.log(this._data);
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
        if (this._editEvent.getElement().parentNode === this._container) {
          // this._editEvent.resetForm();
          this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
        }

        document.removeEventListener(`keydown`, this._onEscKeyDown);
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
          .addEventListener(`submit`, (evt) => {
            evt.preventDefault();

            const entry = this._buildNewData();
            console.log(entry);
            console.log(entry.toRAW());

            this.blockForm(`save`, true);
            setTimeout(this._onDataChange.bind(this,
                mode === Mode.DEFAULT ? `update` : `create`,
                entry,
                () => {
                  this.onErrorDataChange();
                }),
            ON_DATA_CHANGE_DELAY);

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


// import {TripItem} from './../components/event-item.js';
// import {TripItemEdit} from './../components/trip-edit.js';
// import {render, unrender} from './../utils.js';
// import flatpickr from 'flatpickr';
// import moment from 'moment';
//
// export const Mode = {
//   ADDING: `adding`,
//   DEFAULT: `default`,
// };
//
// const ON_DATA_CHANGE_DELAY = 1000;
//
// export class PointController {
//   constructor(container, data, mode, onDataChange, onChangeView, types, destinations) {
//     this._container = container;
//     this._data = data;
//     this._onChangeView = onChangeView;
//     this._onDataChange = onDataChange;
//     this._tripItem = new TripItem(data, types, destinations);
//     this._tripTypes = types;
//     this._destinations = destinations;
//     this._mode = mode;
//     this._tripEdit = new TripItemEdit(data, mode, types, destinations);
//
//     this.create(this._mode);
//   }
//
//   create(mode) {
//     // console.log(this._tripItem);
//     // console.log(this._tripEdit);
//     this._renderTripItem(this._data, this._container, mode);
//   }
//
//   setDefaultView() {
//     if (this._container.contains(this._tripEdit.getElement())) {
//       this._container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
//     }
//   }
//
//   _renderTripItem(arrayMock, container, mode) {
//     let renderPosition = Position.BEFOREEND;
//     let currentView = this._tripItem;
//
//     if (mode === Mode.ADDING) {
//       renderPosition = Position.BEFORE;
//       currentView = this._tripEdit;
//     }
//
//     const onEscKeyDown = (evt) => {
//       if (evt.key === `Escape` || evt.key === `Esc`) {
//         if (mode === Mode.DEFAULT) {
//           if (container.contains(this._tripEdit.getElement())) {
//             container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
//           }
//         } else if (mode === Mode.ADDING) {
//           container.removeChild(currentView.getElement());
//         }
//
//         document.removeEventListener(`keydown`, onEscKeyDown);
//       }
//     };
//
//     flatpickr(this._tripEdit.getElement().querySelector(`#event-start-time-1`), {
//       altInput: true,
//       allowInput: true,
//       defaultDate: arrayMock.startTime,
//     });
//
//     flatpickr(this._tripEdit.getElement().querySelector(`#event-end-time-1`), {
//       altInput: true,
//       allowInput: true,
//       defaultDate: arrayMock.endTime,
//     });
//
//     // this._tripEdit.getElement()
//     //   .querySelector(`.event__save-btn`)
//     //   .addEventListener(`click`, (evt) => {
//     //     evt.preventDefault();
//     //     const description = this._tripEdit.getElement().querySelector(`.event__destination-description`).innerHTML;
//     //     const photo = this._tripEdit.getElement().querySelector(`.event__photo`).src;
//     //     const formData = new FormData(this._tripEdit.getElement());
//     //     const entry = {
//     //       type: formData.get(`event-type`),
//     //       description,
//     //       photo,
//     //       location: formData.get(`event-destination`),
//     //       price: Number.isInteger(Number.parseInt(formData.get(`event-price`), 0)) === true ? Number.parseInt(formData.get(`event-price`), 0) : 0,
//     //       startTime: Number.parseInt((moment(new Date(formData.get(`event-start-time`))).unix() + `000`), 0),
//     //       endTime: Number.parseInt((moment(new Date(formData.get(`event-end-time`))).unix() + `000`), 0),
//     //       isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
//     //       offers: [
//     //         {
//     //           title: `Add luggage`,
//     //           price: Math.floor(Math.random() * 50) + 5,
//     //           accepted: formData.get(`event-offer-luggage`) === `on` ? true : false,
//     //         },
//     //         {
//     //           title: `Switch to comfort class`,
//     //           price: Math.floor(Math.random() * 200) + 50,
//     //           accepted: formData.get(`event-offer-comfort`) === `on` ? true : false,
//     //         },
//     //         {
//     //           title: `Add meal`,
//     //           price: Math.floor(Math.random() * 10) + 1,
//     //           accepted: formData.get(`event-offer-meal`) === `on` ? true : false,
//     //         },
//     //         {
//     //           title: `Choose seats`,
//     //           price: Math.floor(Math.random() * 50) + 1,
//     //           accepted: formData.get(`event-offer-seats`) === `on` ? true : false,
//     //         },
//     //       ],
//     //     };
//     //     this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);
//     //     document.removeEventListener(`keydown`, this._onEscKeyDown);
//     //   });
//
//     this._tripEdit.getElement()
//       .addEventListener(`submit`, (evt) => {
//         evt.preventDefault();
//
//         const entry = this._buildNewData();
//         console.log(entry);
//         console.log(entry.toRAW());
//
//         this.blockForm(`save`, true);
//         setTimeout(this._onDataChange.bind(this,
//             mode === Mode.DEFAULT ? `update` : `create`,
//             entry,
//             () => {
//               this.onErrorDataChange();
//             }),
//         ON_DATA_CHANGE_DELAY);
//
//         document.removeEventListener(`keydown`, this._onEscKeyDown);
//       });
//
//     this._tripEdit.getElement()
//       .querySelector(`.event__reset-btn`)
//       .addEventListener(`click`, (evt) => {
//         evt.preventDefault();
//
//         this.blockForm(`delete`, true);
//
//         if (mode === Mode.ADDING) {
//           unrender(this._tripEdit.getElement());
//           this._tripEdit.removeElement();
//           this._onDataChange(null, null);
//         } else if (mode === Mode.DEFAULT) {
//           setTimeout(this._onDataChange.bind(this, `delete`, this._data), ON_DATA_CHANGE_DELAY);
//         }
//
//         document.removeEventListener(`keydown`, this._onEscKeyDown);
//       });
//
//     this._tripItem.getElement()
//       .querySelector(`.event__rollup-btn`)
//       .addEventListener(`click`, () => {
//         this._onChangeView();
//         container.replaceChild(this._tripEdit.getElement(), this._tripItem.getElement());
//         document.addEventListener(`keydown`, onEscKeyDown);
//       });
//
//     if (this._mode === `default`) {
//       this._tripEdit.getElement()
//         .querySelector(`.event__rollup-btn`)
//         .addEventListener(`click`, () => {
//           container.replaceChild(this._tripItem.getElement(), this._tripEdit.getElement());
//           document.removeEventListener(`keydown`, onEscKeyDown);
//         });
//
//       // this._tripEdit.getElement()
//       //   .querySelector(`.event__reset-btn`)
//       //   .addEventListener(`click`, () => {
//       //     this._onDataChange(null, this._data);
//       //   });
//     }
//
//     if (this._mode === `adding`) {
//       this._tripEdit.getElement()
//         .querySelector(`.event__reset-btn`)
//         .addEventListener(`click`, () => {
//           removeElement(this._tripEdit.getElement());
//         });
//
//       // this._tripEdit.getElement()
//       //   .querySelector(`.event__save-btn`)
//       //   .addEventListener(`click`, () => {
//       //     removeElement(this._tripEdit.getElement());
//       //   });
//     }
//     render(container, currentView.getElement(), renderPosition);
//   }
//
//   _checkDays() {
//     let allDays = document.querySelectorAll(`.trip-days__item`);
//     Array.from(allDays).forEach((day) => {
//       if (Array.from(day.querySelectorAll(`.event`)).length === 0) {
//         removeElement(day);
//       }
//     });
//   }
//
//   blockForm(btnValue, isDisabled) {
//     const buttonSave = this._tripEdit.getElement().querySelector(`.event__save-btn`);
//     const buttonDelete = this._tripEdit.getElement().querySelector(`.event__reset-btn`);
//
//     const setDisabledValue = (elem, selector) => {
//       elem.querySelectorAll(selector).forEach((input) => {
//         input.disabled = isDisabled;
//       });
//     };
//
//     this._tripEdit.getElement().style.boxShadow = ``;
//
//     this._tripEdit.getElement().querySelector(`.event__type-toggle`).disabled = isDisabled;
//     this._tripEdit.getElement().querySelector(`.event__favorite-checkbox`).disabled = isDisabled;
//     this._tripEdit.getElement().querySelector(`.event__rollup-btn`).disabled = isDisabled;
//     setDisabledValue(this._tripEdit.getElement(), `.event__input`);
//     setDisabledValue(this._tripEdit.getElement(), `.event__offer-checkbox`);
//     buttonSave.disabled = isDisabled;
//     buttonDelete.disabled = isDisabled;
//
//     if (isDisabled) {
//       if (btnValue === `save`) {
//         buttonSave.textContent = `Saving...`;
//       } else {
//         buttonDelete.textContent = `Deleting...`;
//       }
//     } else {
//       buttonSave.textContent = `Save`;
//       buttonDelete.textContent = `Delete`;
//     }
//   }
//
//   _buildNewData() {
//     const pointId = this._tripEdit.getElement().id;
//     const formData = new FormData(this._tripEdit.getElement());
//     const checkedType = Array.from(this._tripEdit.getElement().querySelectorAll(`.event__type-input`)).find((evtType) => evtType.checked);
//     const pointImages = Array.from(this._tripEdit.getElement().querySelectorAll(`.event__photo`)).map((img) => ({
//       src: img.src,
//       description: img.alt
//     }));
//     const pointDescription = this._tripEdit.getElement().querySelector(`.event__destination-description`).textContent;
//
//     const timeFrom = Number.parseInt((moment(new Date(formData.get(`event-start-time`))).unix() + `000`), 0);
//     const timeTo = Number.parseInt((moment(new Date(formData.get(`event-end-time`))).unix() + `000`), 0);
//     // console.log(checkedType.dataset.placeholder);
//     const pointOffers = Array.from(this._tripEdit.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => {
//       return ({
//         title: offer.querySelector(`.event__offer-title`).textContent,
//         price: Number(offer.querySelector(`.event__offer-price`).textContent),
//         accepted: offer.querySelector(`.event__offer-checkbox`).checked
//       });
//     });
//
//     const entry = {
//       id: pointId,
//       type: {
//         value: formData.get(`event-type`),
//         placeholder: `to`
//       },
//       destination: {
//         name: formData.get(`event-destination`),
//         description: pointDescription,
//         pictures: pointImages,
//       },
//       eventTime: {
//         from: timeFrom,
//         to: timeTo
//       },
//       price: Number(formData.get(`event-price`)),
//       isFavorite: Boolean(formData.get(`event-favorite`)),
//       offers: pointOffers,
//       toRAW() {
//         return {
//           'id': this.id,
//           'type': this.type.value,
//           'destination': this.destination,
//           'date_from': this.eventTime.from,
//           'date_to': this.eventTime.to,
//           'base_price': this.price,
//           'is_favorite': this.isFavorite,
//           'offers': this.offers
//         };
//       }
//     };
//
//     return entry;
//   }
// }

import {getTripInfoTemplate} from './components/trip-info.js';
import {TripControls} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {Statistics} from './components/statistics.js';
import {sortArrayOfObjByDate, fillTripInfo, getAddNewEvent, render, Position} from './utils.js';
import {renderComponent} from './render.js';
import {mockArray} from './data.js';
import {TripController} from './controllers/trip-controller.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const tripInfoContainer = document.querySelector(`.trip-info`);
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);
const pageContainer = document.querySelector(`.page-main .page-body__container`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const tripControls = new TripControls();
const statistics = new Statistics();

export const sortedMockArray = sortArrayOfObjByDate(mockArray);

statistics.getElement().classList.add(`visually-hidden`);
render(pageContainer, statistics.getElement(), Position.AFTERBEGIN);
renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);


render(tripControlsContainer, tripControls.getElement(), Position.BEFORE);

renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripDayTemplate(), tripEventsContainer);
fillTripInfo(sortedMockArray);

let tripController = new TripController(tripEventsContainer, sortedMockArray);
tripController.init();
getAddNewEvent();

tripControls.getElement().addEventListener(`click`, (evt) => {
  const table = tripControls.getElement().querySelector(`.trip-tabs__btn`);
  const stats = tripControls.getElement().querySelector(`.trip-tabs__btn:nth-child(2)`);
  evt.preventDefault();

  switch (evt.target.innerHTML) {
    case `Table`:
      statistics.getElement().classList.add(`visually-hidden`);
      tripController.show();
      evt.target.classList.add(`trip-tabs__btn--active`);
      stats.classList.remove(`trip-tabs__btn--active`);
      table.classList.add(`trip-tabs__btn--active`);
      break;
    case `Stats`:
      tripController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      evt.target.classList.add(`trip-tabs__btn--active`);
      table.classList.remove(`trip-tabs__btn--active`);
      stats.classList.add(`trip-tabs__btn--active`);
      break;
  }
});

newPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripController.createPoint();
});

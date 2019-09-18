import {getTripInfoTemplate} from './components/trip-info.js';
import {TripControls} from './components/trip-controls.js';
import {TripFilters} from './components/trip-filters.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {Statistics} from './components/statistics.js';
import {sortArrayOfObjByDate, fillTripInfo, getAddNewEvent, render, unrender, Position} from './utils.js';
import {renderComponent} from './render.js';
import {mockArray} from './data.js';
import {TripController} from './controllers/trip-controller.js';
import {StatisticController} from './controllers/statistics-controller.js';
import * as _ from 'lodash';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const tripInfoContainer = document.querySelector(`.trip-info`);
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);
const pageContainer = document.querySelector(`.page-main .page-body__container`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const tripFilters = new TripFilters();
const tripControls = new TripControls();
let statistics = new Statistics();

let sortedMockArray = sortArrayOfObjByDate(mockArray);

const onDataChange = (points) => {
  sortedMockArray = points;
  fillTripInfo(sortedMockArray);
};

statistics.getElement().classList.add(`visually-hidden`);
render(pageContainer, statistics.getElement(), Position.AFTERBEGIN);
renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);


render(tripControlsContainer, tripControls.getElement(), Position.BEFORE);
render(tripControlsContainer, tripFilters.getElement(), Position.BEFORE);
renderComponent(getTripDayTemplate(), tripEventsContainer);
fillTripInfo(sortedMockArray);

let tripController = new TripController(tripEventsContainer, onDataChange);
let statisticController = new StatisticController(statistics.getElement(), sortedMockArray);
statisticController.hide();
tripController.show(sortedMockArray);
getAddNewEvent();


tripControls.getElement().addEventListener(`click`, (evt) => {
  const table = tripControls.getElement().querySelector(`.trip-tabs__btn`);
  const stats = tripControls.getElement().querySelector(`.trip-tabs__btn:nth-child(2)`);
  evt.preventDefault();

  switch (evt.target.innerHTML) {
    case `Table`:
      statistics.getElement().classList.add(`visually-hidden`);
      tripController.show(sortedMockArray);

      evt.target.classList.add(`trip-tabs__btn--active`);
      stats.classList.remove(`trip-tabs__btn--active`);
      table.classList.add(`trip-tabs__btn--active`);
      break;
    case `Stats`:
      tripController.hide();
      unrender(statistics.getElement());
      statistics = null;
      statistics = new Statistics();
      render(pageContainer, statistics.getElement(), Position.AFTERBEGIN);
      statisticController = new StatisticController(statistics.getElement(), sortedMockArray);

      evt.target.classList.add(`trip-tabs__btn--active`);
      table.classList.remove(`trip-tabs__btn--active`);
      stats.classList.add(`trip-tabs__btn--active`);
      break;
  }
});

newPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripController.createPoint();
  tripController.show(sortedMockArray);
});

tripFilters.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  const filterAll = `filter-everything`;
  const filterFuture = `filter-future`;
  const filterPast = `filter-past`;

  switch (evt.target.id) {
    case filterAll:
      tripController.show(sortedMockArray);
      break;
    case filterFuture:
      tripController.show(_.filter(sortedMockArray, (point) => point.startTime > Date.now()));
      break;
    case filterPast:
      tripController.show(_.filter(sortedMockArray, (point) => point.startTime < Date.now()));
      break;
  }
});

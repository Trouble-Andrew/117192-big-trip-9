import {getTripInfoTemplate} from './components/trip-info.js';
import {getTripControlsTemplate} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripSortTemplate} from './components/trip-sort.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {sortArrayOfObjByDate, fillTripInfo, getAddNewEvent} from './utils.js';
import {renderComponent} from './render.js';
import {mockArray} from './data.js';
import {TripController} from './controllers/trip-controller.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);
let tripDaysContainer = document.querySelector(`.trip-days`);

export const sortedMockArray = sortArrayOfObjByDate(mockArray);

renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
renderComponent(getTripDayTemplate(), tripEventsContainer);
tripDaysContainer = document.querySelector(`.trip-days`);
fillTripInfo(sortedMockArray);

let tripController = new TripController(tripDaysContainer, sortedMockArray);
tripController.init();
getAddNewEvent();

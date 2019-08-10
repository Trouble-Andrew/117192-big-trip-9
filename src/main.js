import {getTripInfoTemplate} from './components/trip-info.js';
import {getTripControlsTemplate} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripSortTemplate} from './components/trip-sort.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {getTripItemEditTemplate} from './components/trip-edit.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);

// Render function

const renderComponent = (markup, container, repeat = 1, position = `beforeend`, callback = () => undefined) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(position, markup);
  }
  callback();
};


renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
renderComponent(getTripItemEditTemplate(), tripEventsContainer);
renderComponent(getTripDayTemplate(), tripEventsContainer, 3);

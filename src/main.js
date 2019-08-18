import {getTripInfoTemplate} from './components/trip-info.js';
import {getTripControlsTemplate} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripSortTemplate} from './components/trip-sort.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {getTripItemEditTemplate} from './components/trip-edit.js';
import {getEventItemTemplate} from './components/event-item.js';
import {renderComponent} from './render.js';
import {getEvent, mockItem} from './data.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);
// const tripEventList = document.querySelector(`.trip-events__list`);

const renderTripItem = (container, mockItem) => {
  let {type, location, photo, description, startTime, endTime, diffTime, price, offers} = mockItem;
  container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type, location, photo, description, startTime, endTime, diffTime, price, offers}));
  // tasksForLoad = tasksForLoad.slice(1);
};

renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
renderComponent(getTripItemEditTemplate(), tripEventsContainer);
// renderComponent(getTripDayTemplate(), tripEventsContainer, 3);
renderComponent(getTripDayTemplate(), tripEventsContainer, 3, `beforeend`, () => {
  const tripEventList = document.querySelector(`.trip-events__list`);

  renderTripItem(tripEventList, mockItem);
  console.log(mockItem);
  console.log(tripEventList);

});






// renderTripItem(tripEventList, mockItem);

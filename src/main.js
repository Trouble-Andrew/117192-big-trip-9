import {getTripInfoTemplate} from './components/trip-info.js';
import {getTripControlsTemplate} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripSortTemplate} from './components/trip-sort.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {getTripItemEditTemplate} from './components/trip-edit.js';
import {getEventItemTemplate} from './components/event-item.js';
import {sortArrayOfObjByDate, fillTripInfo} from './utils.js';
import {renderComponent} from './render.js';
import {mockArray} from './data.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);

export const sortedMockArray = sortArrayOfObjByDate(mockArray);

const renderTripEdit = (container) => {
  let {type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, price, offers, isFavorite} = sortedMockArray[0];
  container.insertAdjacentHTML(`beforeend`, getTripItemEditTemplate({type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, price, offers, isFavorite}));
};

const renderTripItem = (container, array, count) => {
  let dayCounter = 1;
  let currentDay = array[0].startTimeEdit.getDate();
  container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type: array[0].type, location: array[0].location, photo: array[0].photo, description: array[0].description, startTime: array[0].startTime, startTimeEdit: array[0].startTimeEdit, endTime: array[0].endTime, endTimeEdit: array[0].endTimeEdit, diffTime: array[0].diffTime, price: array[0].price, offers: array[0].offers, dayCounter}));
  for (let i = 1; i < count; i++) {
    let {type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, diffTime, price, offers} = array[i];
    if (currentDay !== array[i].startTimeEdit.getDate()) {
      dayCounter += 1;
      container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, diffTime, price, offers, dayCounter}));
    } else {
      container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, diffTime, price, offers}));
    }
  }
};

renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
renderTripEdit(tripEventsContainer);
renderComponent(getTripDayTemplate(), tripEventsContainer, 3, `beforeend`, () => {
  const tripDays = document.querySelector(`.trip-days`);
  renderTripItem(tripDays, sortedMockArray, sortedMockArray.length);
});

fillTripInfo(sortedMockArray);

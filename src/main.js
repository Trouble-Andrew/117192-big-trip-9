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

console.log(mockArray);
export const sortedMockArray = sortArrayOfObjByDate(mockArray);
console.log(sortedMockArray);

// const datesArr = new Set([]);
// sortedMockArray.forEach(function (item) {
//   datesArr.add(item.startTimeEdit.getDate());
// });
// console.log(datesArr);

// const tripEventList = document.querySelector(`.trip-events__list`);

// const renderTripItem = (container, mockItem) => {
//   let {type, location, photo, description, startTime, endTime, diffTime, price, offers} = mockItem;
//   container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type, location, photo, description, startTime, endTime, diffTime, price, offers}));
//   // tasksForLoad = tasksForLoad.slice(1);
// };

const renderTripEdit = (container) => {
  let {type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, price, offers, isFavorite} = sortedMockArray[0];
  container.insertAdjacentHTML(`beforeend`, getTripItemEditTemplate({type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, price, offers, isFavorite}));
};

const renderTripItem = (container, array, count) => {
  for (let i = 1; i < count; i++) {
    let {type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, diffTime, price, offers} = array[i];
    container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type, location, photo, description, startTime, startTimeEdit, endTime, endTimeEdit, diffTime, price, offers}));
  }
};

renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
// renderComponent(getTripItemEditTemplate(), tripEventsContainer);
renderTripEdit(tripEventsContainer);
// renderComponent(getTripDayTemplate(), tripEventsContainer, 3);
renderComponent(getTripDayTemplate(), tripEventsContainer, 3, `beforeend`, () => {
  const tripEventList = document.querySelector(`.trip-events__list`);
  // const tripDays = document.querySelector(`.trip-days`);
  renderTripItem(tripEventList, sortedMockArray, sortedMockArray.length);
});

fillTripInfo(sortedMockArray);

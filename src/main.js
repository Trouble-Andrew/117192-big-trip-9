import {getTripInfoTemplate} from './components/trip-info.js';
import {getTripControlsTemplate} from './components/trip-controls.js';
import {getTripFiltersTemplate} from './components/trip-filters.js';
import {getTripSortTemplate} from './components/trip-sort.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {TripItem} from './components/event-item.js';
import {sortArrayOfObjByDate, fillTripInfo, getAddNewEvent} from './utils.js';
import {renderComponent} from './render.js';
import {mockArray} from './data.js';

const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);

export const sortedMockArray = sortArrayOfObjByDate(mockArray);

renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);
renderComponent(getTripControlsTemplate(), tripControlsContainer, 1, `beforebegin`);
renderComponent(getTripFiltersTemplate(), tripControlsContainer, 1, `afterend`);
renderComponent(getTripSortTemplate(), tripEventsContainer);
renderComponent(getTripDayTemplate(), tripEventsContainer);

const renderTripItem = (arrayMock) => {
  const tripItem = new TripItem(arrayMock);
  const tripDaysContainer = document.querySelector(`.trip-days`);
  tripItem.renderElement(tripDaysContainer);
};

let dayCounter = 1;
let currentDay = sortedMockArray[0].startTimeEdit.getDate();
sortedMockArray[0].dayCounter = dayCounter;
renderTripItem(sortedMockArray[0]);
for (let i = 1; i < sortedMockArray.length; i++) {
  if (currentDay !== sortedMockArray[i].startTimeEdit.getDate()) {
    dayCounter += 1;
    sortedMockArray[i].dayCounter = dayCounter;
    renderTripItem(sortedMockArray[i]);
  } else {
    renderTripItem(sortedMockArray[i]);
  }
}

fillTripInfo(sortedMockArray);
getAddNewEvent();

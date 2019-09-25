import moment from 'moment';
import * as _ from 'lodash';

export const shuffle = function (arr) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

export const getFormattedTimeDifference = function (start, end) {
  const diff = moment(end).diff(moment(start));
  const duration = moment.duration(diff);

  const minutesPart = `${String(duration.minutes()).padStart(2, `0`)}M`;
  const hoursPart = (duration.days() > 0 || duration.hours() > 0) ? `${String(duration.hours()).padStart(2, `0`)}H` : ``;
  const daysPart = duration.days() > 0 ? `${String(duration.days()).padStart(2, `0`)}D` : ``;

  return `${daysPart} ${hoursPart} ${minutesPart}`;
};

export const sortArrayOfObjByDate = function (tripPoints) {
  let byDate = tripPoints.slice(0);
  return byDate.sort(function (a, b) {
    return a.startTime - b.startTime;
  });
};

export const fillTripInfo = (tripPoints) => {
  tripPoints = sortArrayOfObjByDate(tripPoints);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let tripCities = [];
  let tripDates = new Set([]);
  let tripCost = [];
  let offersCost = [];

  let tripCitiesElem = document.querySelector(`.trip-info__title`);
  let tripDatesElem = document.querySelector(`.trip-info__dates`);
  let tripCostElem = document.querySelector(`.trip-info__cost`);

  tripPoints.forEach(function (item) {
    offersCost.push(_.map(_.filter(item.offers, [`accepted`, true]), `price`));
    tripCities.push(item.location);
    tripDates.add(new Date(item.startTime).getDate());
    tripCost.push(item.price);
  });

  tripCitiesElem.innerHTML = tripPoints.length > 3 ? `${tripCities[0]} — ... — ${tripCities[tripCities.length - 1]}` : `${tripCities.join(`—`)}`;
  tripDatesElem.innerHTML = tripPoints.length !== 0 ? `${moment(tripPoints[0].startTime).format(`D MMM`)} — ${moment(tripPoints[tripPoints.length - 1].endTime).format(`D MMM`)}` : `... — ...`;
  tripCostElem.innerHTML = tripPoints.length !== 0 ? `Total: &euro;&nbsp; ${tripCost.reduce(reducer) + _.flattenDeep(offersCost).reduce(reducer)}` : `Total: &euro;&nbsp; 0`;
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const removeElement = (element) => {
  element.remove();
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.BEFORE:
      container.before(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const getAddNewEvent = () => {
  let tripEventsContainer = document.querySelector(`.trip-events`);
  let allEvents = tripEventsContainer.querySelectorAll(`.trip-days__item`);
  if (allEvents.length === 0) {
    Array.from(tripEventsContainer.children).forEach((element) => element.classList.add(`visually-hidden`));
    tripEventsContainer.querySelector(`h2`).classList.add(`visually-hidden`);
    tripEventsContainer.insertAdjacentHTML(`afterbegin`, `<p class="trip-events__msg">Click New Event to create your first point</p>`);
  } else {
    Array.from(tripEventsContainer.children).forEach((element) => element.classList.remove(`visually-hidden`));
    tripEventsContainer.querySelector(`h2`).classList.add(`visually-hidden`);
    unrender(document.querySelector(`.trip-events__msg`));
  }
};

export const TRANSPORT_TYPES = new Set([`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`]);

export const pretext = (text) => {
  let phrase;
  switch (text) {
    case `Taxi`:
      phrase = text + ` to`;
      break;
    case `Bus`:
      phrase = text + ` to`;
      break;
    case `Train`:
      phrase = text + ` at`;
      break;
    case `Transport`:
      phrase = text + ` to`;
      break;
    case `Drive`:
      phrase = text + ` to`;
      break;
    case `Flight`:
      phrase = text + ` to`;
      break;
    case `Ship`:
      phrase = text + ` to`;
      break;
    case `Check-in`:
      phrase = `Check into`;
      break;
    case `Sightseeing`:
      phrase = text + ` in`;
      break;
    case `Restaurant`:
      phrase = text + ` in`;
      break;
  }
  return phrase;
};

export const getFilterType = () => {
  const filters = document.querySelector(`.trip-filters`);
  const filtersNodes = filters.querySelectorAll(`input`);
  const checkedElement = Array.from(filtersNodes).filter((element) => element.checked === true);

  return checkedElement[0].id;
};

export const getSortType = () => {
  const sort = document.querySelector(`.trip-sort`);

  const sortNodes = sort.querySelectorAll(`input`);
  const checkedElement = Array.from(sortNodes).filter((element) => element.checked === true);

  return checkedElement[0].id;
};

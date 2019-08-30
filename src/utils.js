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

export const diffGetTime = function (start, end) {
  let date1 = new Date(start);
  let date2 = new Date(end);
  let diff = date2.getTime() - date1.getTime();
  let msec = diff;
  let hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  let mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  return `${hh}H:${mm.length === 1 ? mm + `0` : mm}M`;
};

export const sortArrayOfObjByDate = function (array) {
  let byDate = array.slice(0);
  return byDate.sort(function (a, b) {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
};

export const fillTripInfo = (array) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let tripCities = new Set([]);
  let tripDates = new Set([]);
  let tripCost = [];

  let tripCitiesElem = document.querySelector(`.trip-info__title`);
  let tripDatesElem = document.querySelector(`.trip-info__dates`);
  let tripCostElem = document.querySelector(`.trip-info__cost`);

  array.forEach(function (item) {
    tripCities.add(item.location);
    tripDates.add(new Date(item.startTime).getDate());
    tripCost.push(item.price);
  });

  tripCitiesElem.innerHTML = `${Array.from(tripCities).join(`-`)}`;
  tripDatesElem.innerHTML = `${new Date(array[0].startTime).getDate()} ${new Date(array[0].startTime).toLocaleDateString(`en-GB`, {month: `short`})} - ${new Date(array[array.length - 1].startTime).getDate()} ${new Date(array[0].startTime).toLocaleDateString(`en-GB`, {month: `short`})}`;
  tripCostElem.innerHTML = `Total: &euro;&nbsp; ${tripCost.reduce(reducer)}`;
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
    tripEventsContainer.innerHTML = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
};

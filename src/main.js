import {getTripInfoTemplate} from './components/trip-info.js';
import {TripControls} from './components/trip-controls.js';
import {TripFilters} from './components/trip-filters.js';
import {getTripDayTemplate} from './components/trip-day.js';
import {Statistics} from './components/statistics.js';
import LoadingMessage from "./components/loading-message.js";
import {sortArrayOfObjByDate, fillTripInfo, getAddNewEvent, render, unrender, Position, getFilterType} from './utils.js';
import {renderComponent} from './render.js';
// import {mockArray} from './data.js';
import {TripController} from './controllers/trip-controller.js';
import {StatisticController} from './controllers/statistics-controller.js';
import API from "./api.js";
import * as _ from 'lodash';

const tripInfoContainer = document.querySelector(`.trip-info`);
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);
const pageContainer = document.querySelector(`.page-main .page-body__container`);
const tripControlsContainer = document.querySelector(`.trip-controls h2:nth-child(2)`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const tripFilters = new TripFilters();
const tripControls = new TripControls();
const loadingMessage = new LoadingMessage();
let statistics = new Statistics();

let tripController = null;
// let tripsData = sortArrayOfObjByDate(mockArray);

const AUTHORIZATION = `Basic er883jdzbdw=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const api = new API(END_POINT, AUTHORIZATION);

const filterPointsHandler = (element) => {
  const filterAll = `filter-everything`;
  const filterFuture = `filter-future`;
  const filterPast = `filter-past`;

  switch (element) {
    case filterAll:
      tripController.show(tripsData);
      break;
    case filterFuture:
      tripController.show(_.filter(tripsData, (point) => point.startTime > Date.now()));
      break;
    case filterPast:
      tripController.show(_.filter(tripsData, (point) => point.startTime < Date.now()));
      break;
  }
};

const onDataChange = (actionType, update, onError) => {
  if (actionType === null || update === null) {
    tripController.renderDays(tripsData);
    return;
  }

  switch (actionType) {
    case `update`:
      api.updatePoint({
        id: update.id,
        point: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          tripController.show(points);
          getAddNewEvent();
          fillTripInfo(tripsData);
          getFilterType();
        })
        .catch(() => {
          onError();
        });
      break;
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          console.log(tripsData);
          tripController.show(tripsData);
          getAddNewEvent();
          fillTripInfo(tripsData);
          filterPointsHandler(getFilterType());
          // console.log(document.querySelector(`.event--edit`));
          // pageDataController.updatePage(points);
        })
        .catch(() => {
          onError();
        });
      break;
    case `create`:
      api.createPoint({
        point: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          tripController.show(tripsData);
          getAddNewEvent();
          fillTripInfo(tripsData);
          filterPointsHandler(getFilterType());
          // pageDataController.updatePage(points);
        })
        .catch(() => {
          onError();
        });
      break;
    default:
      throw new Error(`Wrong action type`);
  }
};

let tripsData = null;
let tripTypesWithOptions = null;
let citiesWithDescription = null;

api.getData({url: `offers`})
  .then((offers) => {
    tripTypesWithOptions = offers;
  })
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => {
    citiesWithDescription = destinations;
  })
  .then(() => api.getPoints())
  .then((points) => {
    tripsData = points;
    console.log(tripsData);
    // tripInfoData = getTripInfoData(points.slice().sort((a, b) => a - b));
    fillTripInfo(tripsData);
  })
  .then(() => {
    // tripInfo.setTripInfoData(tripInfoData);
    tripController = new TripController(tripEventsContainer, tripsData, onDataChange, tripTypesWithOptions, citiesWithDescription);
  })
  .then(() => {
    unrender(loadingMessage.getElement());
    loadingMessage.removeElement();
    tripController.init();
    // fullTripPriceElem.textContent = getFullEventPrice(tripsData);
    // document.querySelector(`.trip-info__main`).replaceWith(tripInfo.getElement());
  });

statistics.getElement().classList.add(`visually-hidden`);
render(pageContainer, statistics.getElement(), Position.AFTERBEGIN);
render(pageContainer, loadingMessage.getElement(), `beforeend`);
renderComponent(getTripInfoTemplate(), tripInfoContainer, 1, `afterbegin`);


render(tripControlsContainer, tripControls.getElement(), Position.BEFORE);
render(tripControlsContainer, tripFilters.getElement(), Position.BEFORE);
renderComponent(getTripDayTemplate(), tripEventsContainer);

tripControls.getElement().addEventListener(`click`, (evt) => {
  const table = tripControls.getElement().querySelector(`.trip-tabs__btn`);
  const stats = tripControls.getElement().querySelector(`.trip-tabs__btn:nth-child(2)`);
  evt.preventDefault();

  switch (evt.target.innerHTML) {
    case `Table`:
      statistics.getElement().classList.add(`visually-hidden`);
      tripController.show(tripsData);

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
      evt.target.classList.add(`trip-tabs__btn--active`);
      table.classList.remove(`trip-tabs__btn--active`);
      stats.classList.add(`trip-tabs__btn--active`);
      statisticController = new StatisticController(statistics.getElement(), tripsData);
      break;
  }
});

newPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  unrender(document.querySelector(`.trip-events__msg`));
  tripController.createPoint();
  tripController.show(tripsData);
});

tripFilters.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }
  filterPointsHandler(evt.target.id);
});

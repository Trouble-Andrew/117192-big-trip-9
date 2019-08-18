import {shuffle, diffGetTime} from './utils.js';

const type = new Set([
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`,
  `trip`,
]);
const location = new Set([
  `Geneva`,
  `Saint-Petersburg`,
  `Chamonix`,
  `hotel`,
  `Amsterdam`,
  `airport`,
  `New-York`,
  `Paris`,
  `Prague`,
]);
const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet letius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus letius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const startTime = () => Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000;
const offers = [
  {
    title: `Add luggage`,
    price: Math.floor(Math.random() * 50) + 5,
    isChecked: Boolean(Math.round(Math.random())),
  },
  {
    title: `Switch to comfort class`,
    price: Math.floor(Math.random() * 200) + 50,
    isChecked: Boolean(Math.round(Math.random())),
  },
  {
    title: `Add meal`,
    price: Math.floor(Math.random() * 10) + 1,
    isChecked: Boolean(Math.round(Math.random())),
  },
  {
    title: `Choose seats`,
    price: Math.floor(Math.random() * 50) + 1,
    isChecked: Boolean(Math.round(Math.random())),
  },
];

export const getEvent = function () {
  let date1Stamp = startTime();
  let date1 = new Date();
  date1.setTime(date1Stamp);
  let date2Stamp = date1Stamp;
  let date2 = new Date();
  date2.setTime(date2Stamp);
  date2.setMinutes(date2.getMinutes() + Math.floor(Math.random() * 59) + 1);
  date2.setHours(date2.getHours() + Math.floor(Math.random() * 3) + 1);
  return {
    type: shuffle(Array.from(type))[0],
    location: shuffle(Array.from(location))[0],
    photo: `http://picsum.photos/300/150?r=${Math.random()}`,
    description: shuffle(description.split(`.`)).slice(0, Math.floor(Math.random() * 3) + 1).join(`.`),
    startTime: date1.toLocaleTimeString([], {hour: `2-digit`, minute: `2-digit`}),
    endTime: date2.toLocaleTimeString([], {hour: `2-digit`, minute: `2-digit`}),
    diffTime: diffGetTime(date1, date2),
    price: Math.floor(Math.random() * 2000) + 20,
    offers: offers.filter((offer) => offer.isChecked),
  };
};

export const mockItem = getEvent();

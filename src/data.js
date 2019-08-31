import {shuffle} from './utils.js';

export const mockArray = [];

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
  // `hotel`,
  `Amsterdam`,
  // `airport`,
  `New-York`,
  `Paris`,
  `Prague`,
]);
const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet letius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus letius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
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
  let randomTimeStamp1 = +new Date(2019, (new Date(Date.now()).getMonth()), (Math.floor(Math.random() * 30) + new Date(Date.now()).getDate()), (Math.floor(Math.random() * 24)), (Math.floor(Math.random() * 60)), 0);
  let randomTimeStamp2 = new Date(randomTimeStamp1).setMinutes(new Date(randomTimeStamp1).getMinutes() + Math.floor(Math.random() * 360) + 1);
  return {
    type: shuffle(Array.from(type))[0],
    location: shuffle(Array.from(location))[0],
    photo: `http://picsum.photos/300/150?r=${Math.random()}`,
    description: shuffle(description.split(`.`)).slice(0, Math.floor(Math.random() * 3) + 1).join(`.`),
    startTime: randomTimeStamp1,
    endTime: randomTimeStamp2,
    price: Math.floor(Math.random() * 2000) + 20,
    offers,
    isFavorite: Boolean(Math.round(Math.random())),
  };
};

const addObjToArray = () => {
  for (let i = 0; i < 5; i++) {
    mockArray.push(getEvent());
  }
};

export const mockItem = getEvent();
addObjToArray();

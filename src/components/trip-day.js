import AbstractComponent from './abstract-component.js';

export class TripDay extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

export default TripDay;

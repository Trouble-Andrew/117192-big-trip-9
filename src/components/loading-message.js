import AbstractComponent from './abstract-component.js';

class LoadingMessage extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}

export default LoadingMessage;

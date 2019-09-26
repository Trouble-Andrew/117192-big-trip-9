import AbstractComponent from './abstract-component.js';

class TripInfo extends AbstractComponent {
  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">... — ...</h1>

        <p class="trip-info__dates">... — ...</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
      </p>
    </section>`;
  }
}

export default TripInfo;

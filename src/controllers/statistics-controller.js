import {Statistics} from './../components/statistics.js';
import {TYPES_MAP} from './../components/types-map.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const BAR_HEIGHT = 55;

export class StatisticController {
  constructor(container, points) {
    this._container = container;
    this._statistics = new Statistics();
    this._points = points;

    this.init();
  }

  init() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);

    this._drawChart(moneyCtx, this._getMoneySummary(), `MONEY`, (val) => `€ ${val}`);
    this._drawChart(transportCtx, this._getUseOfTransport(), `TRANSPORT`, (val) => `${val}x`);
    this._drawChart(timeCtx, this._getDurationOfTypePoint(), `TIME SPENT`, (val) => `${val}H`);
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._statistics.getElement().classList.remove(`visually-hidden`);
  }

  _drawChart(container, drawingData, title, format) {
    const labelsType = Object.keys(drawingData);
    const sums = Object.values(drawingData);
    container.height = BAR_HEIGHT * labelsType.length;
    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: labelsType,
        datasets: [{
          data: sums,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: format
          }
        },
        title: {
          display: true,
          text: title,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _getRawDuration({startTime, endTime}) {
    const timeStart = moment(startTime);
    const timeEnd = moment(endTime);
    const myLocalMoment = moment;
    return myLocalMoment.duration(timeEnd.diff(timeStart));
  }

  _getDurationOfTypePoint() {
    let durationOfTypePoint = {};
    this._points.forEach((elementData) => {
      const label = this._getLabel(durationOfTypePoint, elementData);
      durationOfTypePoint[label] += Math.round(this._getRawDuration(elementData).asHours());
    });
    return durationOfTypePoint;
  }

  _getMoneySummary() {
    let moneySummary = {};
    this._points.forEach((elementData) => {
      const label = this._getLabel(moneySummary, elementData);
      moneySummary[label] += elementData.price;
    });
    return moneySummary;
  }

  _getUseOfTransport() {
    let useOfTransport = {};
    this._points.forEach((elementData) => {
      if (TYPES_MAP[elementData.type].type === `move`) {
        const label = this._getLabel(useOfTransport, elementData);
        useOfTransport[label] += 1;
      }
    });
    return useOfTransport;
  }

  _getLabel(obj, elementData) {
    const label = `${TYPES_MAP[elementData.type].icon} ${elementData.type.toUpperCase()}`;
    if (!obj[label]) {
      obj[label] = 0;
    }
    return label;
  }
}

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.startTime = data[`date_from`];
    this.endTime = data[`date_to`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
    this.location = data[`destination`].name;
    this.description = data[`destination`].description;
    this.photo = data[`destination`].pictures;
  }

  static parsePoint(pointData) {
    return new ModelPoint(pointData);
  }

  static parsePoints(pointsData) {
    return pointsData.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.value,
      'destination': this.destination,
      'date_from': this.eventTime.from,
      'date_to': this.eventTime.to,
      'base_price': this.cost,
      'is_favorite': this.isFavorite,
      'offers': this.offers
    };
  }
}

export default ModelPoint;

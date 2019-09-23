import ModelPoint from "./model-point.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static toJSON(response) {
    return response.json();
  }

  getData({url}) {
    return this._load({url})
      .then(API.toJSON);
  }

  getPoints() {
    return this._load({url: `points`})
      .then(API.toJSON)
      .then(ModelPoint.parsePoints);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, point}) {
    console.log(point);
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    console.log(id);
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus);
  }
}

export default API;

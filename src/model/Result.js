import TransportType from "/src/model/TransportType.js";

export default class Result {
  /**
   * Result produced by QueryParser.
   * 
   * @param {Object} params
   * @param {City?} params.from
   * @param {City?} params.to
   * @param {Date?} params.date
   * @param {Time?} params.time
   * @param {TransportType?} params.transportType
   */
  constructor ({ from, to, date, time, transportType}) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.time = time;
    this.transportType = transportType || TransportType.ALL;
  }

  toUrl() {
    let transportType = this.transportType || TransportType.ALL;
    let url = `https://jizdnirady.idnes.cz/${transportType.id}/spojeni/?submit=true&lng=CZECH`;

    if (this.from) {
      url += "&f=" + this.from.name;

      if (this.from.showArea) {
        url += `;%20okres%20${this.from.area}`;
      }
    }
    if (this.to) {
      url += "&t=" + this.to.name;

      if (this.to.showArea) {
        url += `;%20okres%20${this.to.area}`;
      }
    }
    if (this.date) {
      url += "&date=" + this.date.toString();
    }
    if (this.time) {
      url += "&time=" + this.time.toString();
    }

    url += "#header";

    return url;
  }

  toQuery() {
    let query = [];

    if (this.transportType) {
      query.push(this.transportType.toString())
    }
    if (this.from) {
      query.push(this.from.toString());
    }
    if (this.to) {
      query.push(this.to.toString());
    }
    if (this.date) {
      query.push(this.date.toString());
    }
    if (this.time) {
      query.push(this.time.toString());
    }

    return query.join(" ") + " ";
  }

  toDescription() {
    let text = [];

    if (this.transportType) {
      text.push(`Hledat ${this.transportType.toHumanString()}`);
    }

    if (this.from) {
      text.push(`z <match>${this.from.name}</match>`);
      
      if (this.from.showArea) {
        text.push(`<dim>(${this.from.area})</dim>`);
      }
    }

    if (this.to) {
      text.push(`do <match>${this.to.name}</match>`);

      if (this.to.showArea) {
        text.push(`<dim>(${this.to.area})</dim>`);
      }
    } else {
      text.push("do <dim>…</dim>")
    }

    if (this.date || this.time) {
      text.push(text.pop() + ",");
    }

    if (this.date) {
      text.push(`<dim>${this.date.toHumanString()}</dim>`);
    }
    
    if (this.time) {
      text.push(`<dim>v ${this.time.toHumanString()}</dim>`);
    }

    return text.join(" ").trim();
  }
}

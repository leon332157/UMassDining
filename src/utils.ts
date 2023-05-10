export class FluentURL {
  private baseURL: string;
  private params: { [key: string]: string | number | boolean } = {};
  constructor(private url: string) {
    this.baseURL = url;
  }
  addParam(key: string, value: string | number | boolean) {
    this.params[key] = value;
    return this;
  }
  toString() {
    const url = new URL(this.baseURL);
    for (const key in this.params) {
      url.searchParams.append(key, this.params[key].toString());
    }
    return url.toString();
  }
}

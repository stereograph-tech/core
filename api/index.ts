import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import './rxjs';

@Injectable()
export class Api {
  // NOTE:
  // The way Observables work within Angular, is that an Observable
  // HTTP request doesn't get fired off until something subscribes to
  // the Observable via the `.subscribe(...)` method. This means that
  // if you have multiple subscribers within your app, you'll get
  // duplicate requests. To avoid this, we can 'cache' the Observable,
  // and by checking if the 'cached' version is already set, we simply
  // return that cached version.

  constructor(private _http: Http) {
  }

  public get<T>(requestUrl: string, additionalHeaders?: any): Observable<T> {
    const rawHeaders = {
      'Content-Type': 'application/json'
    };
    additionalHeaders = additionalHeaders || {};
    const headers = new Headers(Object.assign(rawHeaders, additionalHeaders));
    const options = new RequestOptions({ headers: headers });

    // Send the HTTP get request
    return this._http.get(requestUrl, options)
      .map(this._extractData)
      .catch(this._handleError)
      .share();
  }

  /**
   * POSTs a request to the given url with the given JSON data
   * @param url
   * @param data
   */
  public post<T>(requestUrl: string, data: any, additionalHeaders?: any): Observable<T> {
    const body = JSON.stringify(data);
    const rawHeaders = {
      'Content-Type': 'application/json'
    };
    additionalHeaders = additionalHeaders || {};
    const headers = new Headers(Object.assign(rawHeaders, additionalHeaders));
    const options = new RequestOptions({ headers: headers });

    return this._http.post(requestUrl, body, options)
      .map(this._extractData)
      .catch(this._handleError)
      .share();
  }

  public postFormData<T>(requestUrl: string, data: FormData, additionalHeaders?: any): Observable<T> {
    const headers = new Headers(additionalHeaders);
    const options = new RequestOptions({ headers: headers });
    return this._http.post(requestUrl, (data || {}).toString(), options)
      .map(this._extractData)
      .catch(this._handleError)
      .share();
  }

  private _extractData<T>(response: Response) {
    let body = null;
    try {
      body = response.json();
    } catch (err) {
      // HACK: response.json() appears to fail when handling primitives
      // returned in the response._body. In that case, simply return
      // the value in the _body.
      if(response['_body']) {
        return response['_body'];
      }
      console.warn('Attempting to deserialize response into JSON failed. The object could be empty.', err);
    }
    return (body as T) || ({} as T);
  }

  private _handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
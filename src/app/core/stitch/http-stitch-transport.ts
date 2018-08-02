import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Transport, Response } from 'mongodb-stitch-core-sdk';

export interface StitchHeaders {
  [key: string]: string;
}

// not exported from mongodb-stitch-core-sdk, so making it up
export interface StitchRequest {
  method: string;
  url: string;
  headers: StitchHeaders;
  body?: string;
}

export function plainHeaders(headers: HttpHeaders): StitchHeaders {
  return headers.keys().reduce((h: StitchHeaders, name: string) => {
    h[name] = headers.get(name) as string;
    return h;
  }, {});
}

/**
 * Stitch Transport implementation, using Angular's HttpClient.
 * Otherwise Stitch by default uses Fetch API, which we cannot easily mock
 * (via HttpTestingController).
 */
@Injectable({
  providedIn: 'root',
})
export class HttpStitchTransport implements Transport {
  public constructor(private http: HttpClient) {}

  public roundTrip(request: StitchRequest): Promise<Response> {
    return this.http
      .request(request.method, request.url, {
        headers: request.headers,
        body: request.body,
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((ngRes: HttpResponse<any>) => {
          // Return Response obj compatible with Stitch
          return new Response(plainHeaders(ngRes.headers), ngRes.status, ngRes.body);
        }),
        catchError((ngErr: HttpErrorResponse) => {
          // console.warn('HttpStitchTransport err', { request, ngErr });
          return of(new Response(plainHeaders(ngErr.headers), ngErr.status, ngErr.error));
        }),
        // tap((response) => console.log('HttpStitchTransport Stitch response', { request, response })),
      )
      .toPromise();
  }
}

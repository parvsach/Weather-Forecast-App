import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { environment } from './../../environments/environment';

@Injectable()
export class WeatherService {
    constructor(private http: Http) {
        console.log('Production=' + environment.production);
    }

    getWeatherForecast(cityName): Observable<any[]> {
        return this.http.get(environment.baseUrl + 'forecast?q=' + cityName + '&appid=' + environment.appId).map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: any) {
        let errMsg: string;
        errMsg = error.message
            ? error.message
            : error.toString();
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
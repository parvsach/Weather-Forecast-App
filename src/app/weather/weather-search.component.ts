import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import cities from 'cities.json';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import uniqueBy from 'unique-by';
import { ForeCastData } from './ForeCastData';
import { WeatherService } from './weather-service';

@Component({
    selector: 'weather-search',
    templateUrl: './weather-search.component.html',
    styleUrls: ['weather-search.component.css']
})

export class WeatherSearchComponent {

    private searchTerm: FormControl = new FormControl();
    private searchResult = [];
    private foreCastResult: [];
    private showWeatherForecast: boolean = false;
    private selectedItem: string = '';

    constructor(private _weatherService: WeatherService) {
        this.searchTerm.valueChanges
            .debounceTime(400)
            .subscribe(data => {
                if (data) {
                    let filteredData = uniqueBy(cities.filter((item, i) => {
                        return item.name.toLowerCase().includes(data.toLowerCase());
                    }), function getValue(obj) {
                        return obj.country;
                    }).map(item => item.name + ', ' + item.country);

                    this.searchResult = filteredData;
                    if (!this.selectedItem) {
                        this.showWeatherForecast = false;
                    }
                } else {
                    this.searchResult = [];
                    this.showWeatherForecast = false;
                }
            })
    }

    ngOnInit() {
    }

    public show(item: string): void {
        if (item) {
            this._weatherService.getWeatherForecast(item).subscribe(
                response => {
                    console.log(response);
                    this.selectedItem = item;
                    this.showWeatherForecast = true;
                    this._formatWeatherData(response);
                    this.selectedItem = '';
                }
            );
        }
    }

    private _formatWeatherData(data) {
        const tiles = this._groupByDays(data);
        const forecastTiles = Object.keys(tiles).length > 5 ? Object.entries(tiles).slice(0, 5) : tiles;
        this.foreCastResult = forecastTiles.map((item, i) => {
            return <ForeCastData>{
                icon: this._getIcon(item[1]),
                humidity: this._getHumidity(item[1]),
                pressure: this._getPressure(item[1]),
                temp: this._getTemprature(item[1]),
                description: this._getDescription(item[1]),
                speed: this._getSpeed(item[1])
            }
        });
    }

    _getIcon = data => `https://openweathermap.org/img/w/${data[0].weather[0].icon}.png`;

    _getHumidity = data => data[0].main.humidity;

    _getPressure = data => data[0].main.pressure;

    _getTemprature = data => data[0].main.temp;

    _getDescription = data => data[0].weather[0].description;

    _getSpeed = data => data[0].wind.speed;

    private _groupByDays(data) {
        return (data.list.reduce((list, item) => {
            const forecastDate = item.dt_txt.substr(0, 10);
            list[forecastDate] = list[forecastDate] || [];
            list[forecastDate].push(item);

            return list;
        }, {}));
    }
}
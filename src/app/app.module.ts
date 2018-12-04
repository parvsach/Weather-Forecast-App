import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WeatherSearchComponentModule } from './weather/weather-search.component.module';
import { WeatherService } from './weather/weather-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule, WeatherSearchComponentModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
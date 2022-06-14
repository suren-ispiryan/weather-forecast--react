import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Navbar from './components/Navbar';
import WeatherForecast from './components/WeatherForecast';
import FavoriteCityList from './components/FavoriteCityList';
import ShowFor5Days from './components/ShowFor5Days';
import './App.css';

const baseHourlyUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const base5DaysUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const appKey = '9198cb0d23a984cfdf8cbdf9a6d55b64';

const App = () => {
    const [currentPlace, setCurrentPlace] = useState({});
    const [unit, setUnit] = useState('metric');
    const [mode, setMode] = useState('°C');
    const [city, setCity] = useState('Yerevan');
    const [errorNoCountry, setErrorNoCountry] = useState('');
    const [favourite, setFavourite] = useState([]);
    const [rise, setRise] = useState('');
    const [set, setSet] = useState('');
    const [favouriteCity, setFavouriteCity] = useState('');
    const [details, setDetails] = useState([{}]);

    useEffect(() => {
        if (favouriteCity !== '') {
            axios.get(`${baseUrl}?&units=${unit}&q=${favouriteCity}&appid=${appKey}`)
                .then(res => {
                    setCurrentPlace(res.data)
                    setErrorNoCountry('')
                    epochTimeToDate();
                })
                .catch(() => { setErrorNoCountry('Sorry, no such a country or city') });
        } else {
            navigator.geolocation.getCurrentPosition(function (position) {
                axios.get(`${baseUrl}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${appKey}`)
                    .then(res => {
                        setCurrentPlace(res.data)
                    })
                    .catch(e => {
                        console.log(e);
                    });
            });
        }
    }, [unit]);

    useEffect(() => {
        const data = []
        if (Object.values(currentPlace).length) {
            console.log('currentPlace', currentPlace)
            for(const [key, value] of Object.entries(currentPlace)) {
                switch (key) {
                    case 'main':
                        data.push({
                            header: 'Per day',
                            data: 'From '+value.temp_min+mode+' to '+value.temp_max+mode
                        })
                        data.push({
                            header: 'Humidity',
                            data: value.humidity+'%'
                        })
                        data.push({
                            header: 'Pressure',
                            data: value.pressure+'mb'
                        })
                        break;

                    case 'coord':
                        data.push({
                            header: 'Coordinates',
                            data:  'Latitude '+value.lat+'°'+' Longitude '+value.lon+'°'
                        })
                        break;

                    case 'timezone':
                        data.push({
                            header: 'Timezone',
                            data: 'GMT+'+value/3600
                        })
                        break;

                    case 'sys':
                        data.push({
                            data: rise,
                            header: 'Sunrise'
                        })
                        data.push({
                            header: 'Sunset',
                            data: set
                        })
                        break;

                    case 'weather':
                        data.push({
                            header: 'Description',
                            data: value[0].description
                        })
                        break;

                    case 'wind':
                        data.push({
                            header: 'Wind',
                            data: value.deg + 'deg ' + value.speed + ' km/h'
                        })
                        break;
                }
            }

            console.log('data', data)
            console.log('curent', currentPlace)
            setDetails(data)
        }
    }, [currentPlace]);

    const changeMetricSystem = () => {
        if (unit === 'metric') {
            setUnit('imperial');
            setMode('°F');
        } else {
            setUnit('metric')
            setMode('°C')
        }
    };

    const epochTimeToDate = () => {
        setRise(moment.unix(currentPlace.sys.sunrise).format('HH:mm:ss'))
        setSet(moment.unix(currentPlace.sys.sunset).format('HH:mm:ss'))
    }

    return (
        <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <WeatherForecast
                                details={details}
                                changeMetricSystem={changeMetricSystem}
                                baseHourlyUrl={baseHourlyUrl}
                                rise={rise}
                                set={set}
                                favourite={favourite}
                                setFavourite={setFavourite}
                                currentPlace={currentPlace}
                                setCurrentPlace={setCurrentPlace}
                                baseUrl={baseUrl}
                                appKey={appKey}
                                unit={unit}
                                mode={mode}
                                city={city}
                                setCity={setCity}
                                errorNoCountry={errorNoCountry}
                                setErrorNoCountry={setErrorNoCountry}
                                epochTimeToDate={epochTimeToDate}
                            />
                        }
                    />
                    <Route
                        path="/favorite"
                        element={
                            <FavoriteCityList
                                setFavouriteCity={setFavouriteCity}
                                favourite={favourite}
                                setFavourite={setFavourite}
                                baseUrl={baseUrl}
                                appKey={appKey}
                                unit={unit}
                                setCurrentPlace={setCurrentPlace}
                                setErrorNoCountry={setErrorNoCountry}
                                epochTimeToDate={epochTimeToDate}
                            />
                        }
                    />
                    <Route
                        path="/5/days"
                        element={
                            <ShowFor5Days
                                base5DaysUrl={base5DaysUrl}
                                baseHourlyUrl={baseHourlyUrl}
                                changeMetricSystem={changeMetricSystem}
                                currentPlace={currentPlace}
                                appKey={appKey}
                                unit={unit}
                                mode={mode}
                                epochTimeToDate={epochTimeToDate}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
    );
}

export default App;

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
const appKey = 'a8d6c74d40d47c4f2690d0c7156f3d96';

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
        // TODO: remove states and use one state
        setRise(moment.unix(currentPlace.sys.sunrise).format('HH:mm:s'))
        // setCurrentPlace({
        //     ...currentPlace,
        //     sys: {
        //         ...currentPlace.sys,
        //         sunrise: moment.unix(currentPlace.sys.sunrise).format('HH:mm:s'),
        //         sunset: moment.unix(currentPlace.sys.sunset).format('HH:mm:s')
        //     }
        // })
        setSet(moment.unix(currentPlace.sys.sunset).format('HH:mm:s'))
    }

    return (
        <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <WeatherForecast
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

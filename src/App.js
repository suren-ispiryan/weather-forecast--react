import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import WeatherForecast from './components/WeatherForecast';
import FavoriteCityList from './components/FavoriteCityList';
import ShowFor5Days from './components/ShowFor5Days';
import axios from 'axios';
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
                .catch(err => { setErrorNoCountry('Sorry, no such a country or city') });
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
        // TODO: use moment.js
        const date = new Date(currentPlace.sys.sunrise * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
        setRise(hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2))

        const date1 = new Date(currentPlace.sys.sunset * 1000);
        const minutes1 = "0" + date1.getMinutes();
        const hours1 = date1.getHours();
        const seconds1 = "0" + date1.getSeconds();
        setSet(hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2))
    }

    return (
        <>
            <BrowserRouter>
                {/* TODO: move to separate component, named header */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="collapse navbar-collapse container" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <span className="sr-only">
                                    <Link to="/" className="nav-link text-light">
                                        | Forecast
                                    </Link>
                                </span>
                            </li>
                            <li className="nav-item active">
                                <span className="sr-only">
                                    <Link to="/favorite" className="nav-link text-light">
                                        | Favourites
                                    </Link>
                                </span>
                            </li>
                            <li className="nav-item active">
                                <span className="sr-only">
                                    <Link to="/5/days" className="nav-link text-light">
                                        | Show weather for 5 days
                                    </Link>
                                </span>
                            </li>
                        </ul>
                    </div>
                </nav>
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
        </>
    );
}

export default App;

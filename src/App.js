import React, { useState } from "react";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import WeatherForecast from "./components/WeatherForecast";
import FavoriteCityList from "./components/FavoriteCityList";
import './App.css';

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const appKey = '166c77d2359e1542961c47c2cabb4d82';

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

    const epochTimeToDate = () => {
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
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="collapse navbar-collapse container " id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <span className="sr-only">
                                    <Link to="/" className="nav-link text-light">Forecast</Link>
                                </span>
                            </li>

                            <li className="nav-item active">
                                <span className="sr-only">
                                    <Link to="/favorite" className="nav-link text-light">Favourites</Link>
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
                                favouriteCity={favouriteCity}
                                setFavouriteCity={setFavouriteCity}
                                rise={rise}
                                set={set}
                                favourite={favourite}
                                setFavourite={setFavourite}
                                currentPlace={currentPlace}
                                setCurrentPlace={setCurrentPlace}
                                baseUrl={baseUrl}
                                appKey={appKey}
                                unit={unit}
                                setUnit={setUnit}
                                mode={mode}
                                setMode={setMode}
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
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

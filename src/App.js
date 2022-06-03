import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherForecast from "./components/WeatherForecast";
import FavoriteCityList from "./components/FavoriteCityList";
import './App.css';

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const appKey = '166c77d2359e1542961c47c2cabb4d82';

const App = () => {
    const [currentPlace, setCurrentPlace] = useState({});
    const [unit, setUnit] = useState('metric');
    const [mode, setMode] = useState('°C');
    const [country, setCountry] = useState('Yerevan');
    const [errorNoCountry, setErrorNoCountry] = useState('');

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <WeatherForecast
                            currentPlace={currentPlace}
                            setCurrentPlace={setCurrentPlace}
                            baseUrl={baseUrl}
                            appKey={appKey}
                            unit={unit}
                            setUnit={setUnit}
                            mode={mode}
                            setMode={setMode}
                            country={country}
                            setCountry={setCountry}
                            errorNoCountry={errorNoCountry}
                            setErrorNoCountry={setErrorNoCountry}
                        />
                    }
                />
                <Route
                    path="/favorite"
                    element={
                        <FavoriteCityList />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

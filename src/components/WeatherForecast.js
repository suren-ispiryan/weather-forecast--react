import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

import './../App.css';
import Search from './Search';

const WeatherForecast = (props) => {
    const {
        favouriteCity,
        setFavouriteCity,
        currentPlace,
        setCurrentPlace,
        baseUrl,
        appKey,
        unit,
        setUnit,
        mode,
        setMode,
        city,
        setCity,
        errorNoCountry,
        setErrorNoCountry,
        favourite,
        setFavourite,
        epochTimeToDate,
        rise,
        set
    } = props

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
       setFavouriteCity('');
    }, []);

    useEffect(() => {
        if (Object.keys(currentPlace).length) {
            epochTimeToDate();
        }
    }, [unit, currentPlace])


    const changeMetricSystem = () => {
        if (unit === 'metric') {
            setUnit('imperial');
            setMode('°F');
        } else {
            setUnit('metric')
            setMode('°C')
        }
    };

    const handleChangeSearchInput = ({ target }) => {
        setCity(target.value);
    }

    return (
        <>
            {Object.keys(currentPlace).length ? (
                <div className="container WeatherForecast">
                    <Search
                        favourite={favourite}
                        setFavourite={setFavourite}
                        baseUrl={baseUrl}
                        city={city}
                        appKey={appKey}
                        unit={unit}
                        setCurrentPlace={setCurrentPlace}
                        errorNoCountry={errorNoCountry}
                        setErrorNoCountry={setErrorNoCountry}
                        epochTimeToDate={epochTimeToDate}
                        currentPlace={currentPlace}
                        handleChangeSearchInput={handleChangeSearchInput}
                    />

                    <div className="row my-5">
                        <div className="col-md-6">
                            <h1>Main data</h1>
                            <hr/>
                            <h2 className="text-success">
                                { currentPlace.name }, { currentPlace.sys.country }
                            </h2>
                            <h4 className="text-success">
                                Now { currentPlace.main.temp } { mode }
                            </h4>
                            <h4 className="text-success">
                                Feels like { Math.round(currentPlace.main.feels_like) } { mode }
                            </h4>

                            <button
                                className="btn btn-primary"
                                onClick={() => changeMetricSystem()}
                            >
                                { unit === 'metric' ? 'Fahrenheit' : 'Celsius' }
                            </button>
                        </div>
                        <div className="col-md-6">
                            <h1>Details</h1>
                            <hr/>
                            <Table striped bordered hover size="md table">
                                <tbody>
                                <tr>
                                    <th>Per day</th>
                                    <td>
                                        min: { currentPlace.main.temp_min } { mode }<br />
                                        max: { currentPlace.main.temp_max } { mode }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Latitude</th>
                                    <td>{ currentPlace.coord.lat }°</td>
                                </tr>
                                <tr>
                                    <th>Longitude</th>
                                    <td>{ currentPlace.coord.lon }°</td>
                                </tr>
                                <tr>
                                    <th>Timezone</th>
                                    <td>GMT+{ currentPlace.timezone / 3600}</td>
                                </tr>
                                <tr>
                                    <th>Humidity</th>
                                    <td>{ currentPlace.main.humidity }%</td>
                                </tr>
                                <tr>
                                    <th>Pressure</th>
                                    <td>{ currentPlace.main.pressure } mb</td>
                                </tr>
                                <tr>
                                    <th>Sunrise</th>
                                    <td>{ rise }</td>
                                </tr>
                                <tr>
                                    <th>Sunset</th>
                                    <td>{ set }</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{ currentPlace.weather[0].description }</td>
                                </tr>
                                <tr>
                                    <th>Wind</th>
                                    <td>{ currentPlace.wind.deg } deg, { currentPlace.wind.speed } km/h</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading">
                    <div className="spinner-grow text-primary" role="status"></div>
                    <div className="spinner-grow text-secondary" role="status"></div>
                    <div className="spinner-grow text-success" role="status"></div>
                    <div className="spinner-grow text-danger" role="status"></div>
                    <div className="spinner-grow text-warning" role="status"></div>
                    <div className="spinner-grow text-info" role="status"></div>
                    <div className="spinner-grow text-light" role="status"></div>
                    <div className="spinner-grow text-dark" role="status"></div>
                    <span className="sr-only mx-4">Loading...</span>
                </div>
            )}
        </>
    );
}

export default WeatherForecast;

import './../App.css';
import React, {useEffect, useState} from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

const WeatherForecast = (props) => {
    const {
        currentPlace,
        setCurrentPlace,
        baseUrl,
        appKey,
        unit,
        setUnit,
        mode,
        setMode,
        country,
        setCountry,
        errorNoCountry,
        setErrorNoCountry
    } = props

    const [rise, setRise] = useState('');
    const [set, setSet] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            axios.get(`${baseUrl}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${appKey}`)
                 .then(res => {
                     setCurrentPlace(res.data)
                     epochTimeToDate(currentPlace.sys.sunrise, currentPlace.sys.sunset);
                 })
                 .catch(e => {
                     console.log(e);
                     // TODO: show error
                 });
        });
    }, [unit]);

    const epochTimeToDate = (sunrise, sunset) => {
        const date = new Date(sunrise * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
        setRise(hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2))

        const date1 = new Date(sunset * 1000);
        const minutes1 = "0" + date1.getMinutes();
        const hours1 = date1.getHours();
        const seconds1 = "0" + date1.getSeconds();
        setSet(hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2))
    }

    const changeToFahrenheit = () => {
        setUnit('imperial');
        setMode('°F');
    };

    const changeToCelsius = () => {
        setUnit('metric')
        setMode('°C')
    };

    const handleChangeSearchInput = ({ target }) => {
        setCountry(target.value);
    }

    const searchCountry = () => {
        axios.get(`${baseUrl}?&units=${unit}&q=${country}&appid=${appKey}`)
             .then(res => {
                setCurrentPlace(res.data)
                setErrorNoCountry('')
                epochTimeToDate(currentPlace.sys.sunrise, currentPlace.sys.sunset);
             })
             .catch(err => { setErrorNoCountry('Sorry, no such a country') });
    }


    return (
        <>
            {Object.keys(currentPlace).length ? (
                <div className="container WeatherForecast">
                    <div className="row my-5">
                        <div className="col-md-2">
                            <input
                                className="form-control search-country"
                                type="text"
                                onChange={handleChangeSearchInput}
                                placeholder="Type a country"
                            />
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-primary"
                                onClick={() =>  searchCountry()}
                            >
                                Search
                            </button>
                        </div>
                        <div className="col-md-4 err-country-text text-danger">
                            <h4>{ errorNoCountry ? errorNoCountry : '' }</h4>
                        </div>
                    </div>
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
                                className="m-2 btn btn-primary"
                                onClick={() => changeToFahrenheit()}
                            >
                                Fahrenheit
                            </button>

                            <button
                                className="m-2 btn btn-primary"
                                onClick={() => changeToCelsius()}
                            >
                                Celsius
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
                <div>No Data...</div>
            )}
        </>
    );
}

export default WeatherForecast;

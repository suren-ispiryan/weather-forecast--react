import React, {useEffect, useState} from "react";
import axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import { v4 as uuidv4 } from 'uuid';

const baseHourly = 'https://api.openweathermap.org/data/2.5/onecall';

const HourlyForecast = (props) => {
    const {
        currentPlace,
        appKey,
        unit,
        mode,
    } = props

    const [currentPlaceHourly, setCurrentPlaceHourly] = useState({});

    useEffect(() => {
        axios.get(`${baseHourly}?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&exclude=hourlyy&appid=${appKey}`)
             .then(res => {
                 setCurrentPlaceHourly(res.data)
             })
             .catch(e => {
                 console.log(e);
             });
    }, [currentPlace]);

    const epochTimeToHour =(h) => {
        const date = new Date(h * 1000);
        const hr = date.getUTCHours();
        const m = "0" + date.getUTCMinutes();
        return hr + ':' + m.substr(-2)
    }

    return (
        <>
            <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        Hourly forecast
                    </Accordion.Header>

                    <Accordion.Body className="hourly-forecast-parent">
                        {
                            Object.keys(currentPlaceHourly).length ? (
                                currentPlaceHourly.hourly.map((hourlyWeather) => (
                                    <div className="hourly-forecast-children p-1 mx-2" key={uuidv4()}>
                                        <p>
                                            <span className="text-primary">Hour </span>
                                            { epochTimeToHour(hourlyWeather.dt) }
                                        </p>

                                        <p>
                                            <span className="text-primary">Feels like: </span>
                                            { Math.round(hourlyWeather.temp) }{ mode }
                                        </p>

                                        <p>
                                            <span className="text-primary">Feels like: </span>
                                            { Math.round(hourlyWeather.feels_like) }{ mode }
                                        </p>

                                        <p>
                                            <span className="text-primary">Humidity: </span>
                                            { hourlyWeather.humidity }%</p>

                                        <p>
                                            <span className="text-primary">Pressure: </span>
                                            { hourlyWeather.pressure }mb
                                        </p>
                                    </div>
                                ))
                            )
                            : (
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
                            )
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default HourlyForecast;

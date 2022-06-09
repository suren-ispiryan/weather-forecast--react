import React, {useEffect, useState} from 'react';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { v4 as uuidv4 } from 'uuid';

const HourlyForecast = (props) => {
    const {
        currentPlace,
        appKey,
        unit,
        mode,
        baseHourlyUrl
    } = props

    const [currentPlaceHourly, setCurrentPlaceHourly] = useState({});

    useEffect(() => {
       axios.get(`${baseHourlyUrl}?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&cnt=5&include=hourlyy&appid=${appKey}`)
             .then(res => {
                 setCurrentPlaceHourly(res.data)
             }).catch(e => {
                 console.log('current place coordinates are not set' ,e);
             });
    }, [unit, currentPlace]);

    const epochTimeToHour = (h) => {
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
                        { Object.keys(currentPlaceHourly).length ? (
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
                        ) : (
                            <LoadingSpinner />
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default HourlyForecast;

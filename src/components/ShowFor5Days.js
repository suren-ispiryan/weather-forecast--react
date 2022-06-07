import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const ShowFor5Days = (props) => {
    const {
        changeMetricSystem,
        currentPlace,
        appKey,
        unit,
        mode,
        epochTimeToDate,
        baseHourly
    } = props

    const [data5Days, setData5Days] = useState({});

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${currentPlace.name}&units=${unit}&include=daily&cnt=5&appid=${appKey}`)
             .then(res => { setData5Days(res.data) })
             .catch(e => { console.log(e) });
    }, [unit, currentPlace]);

    console.log(data5Days)

    const epochTimeToHour =(h) => {
        const date = new Date(h * 1000);
        const hr = date.getUTCHours();
        const m = "0" + date.getUTCMinutes();
        return hr + ':' + m.substr(-2)
    }

    return (
        <>
            {
                Object.keys(data5Days).length ? (
                <div className="container my-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => changeMetricSystem()}
                    >
                        { unit === 'metric' ? 'Fahrenheit' : 'Celsius' }
                    </button>

                    <div className="days-parent">
                        {
                            data5Days.list.map((day) => (
                                <div className="col-md-2 days-weather" key={uuidv4()}>
                                    <div>
                                        <span className="text-primary">Weather forecast for: </span>
                                        {day.dt_txt}
                                        <hr />
                                    </div>
                                    <div>
                                        <span className="text-primary">Current-temp: </span>
                                        {day.main.temp}{mode}
                                    </div>
                                    <div>
                                        <span className="text-primary">Max-temp: </span>
                                        {day.main.temp_max}{mode}
                                    </div>
                                    <div>
                                        <span className="text-primary">Min-temp: </span>
                                        {day.main.temp_min}{mode}
                                    </div>
                                    <div>
                                        <span className="text-primary">Feels like: </span>
                                        {day.main.feels_like}{mode}
                                    </div>
                                    <div>
                                        <span className="text-primary">Pressure: </span>
                                        {day.main.pressure} hPa
                                    </div>
                                    <div>
                                        <span className="text-primary">Grand level: </span>
                                        {day.main.grnd_level} hPa
                                    </div>
                                    <div>
                                        <span className="text-primary">Sea level: </span>
                                        {day.main.sea_level} hPa
                                    </div>
                                    <div>
                                        <span className="text-primary">Visibility: </span>
                                        {day.visibility} M
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                ) : (
                     <div className="loading">
                         <div className="spinner-grow text-primary" role="status" />
                         <div className="spinner-grow text-secondary" role="status" />
                         <div className="spinner-grow text-success" role="status" />
                         <div className="spinner-grow text-danger" role="status" />
                         <div className="spinner-grow text-warning" role="status" />
                         <div className="spinner-grow text-info" role="status" />
                         <div className="spinner-grow text-light" role="status" />
                         <div className="spinner-grow text-dark" role="status" />
                         <span className="sr-only mx-4">Loading...</span>
                     </div>
                )
            }
        </>
    );
}

export default ShowFor5Days;

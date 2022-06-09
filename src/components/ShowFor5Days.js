import React, {useEffect, useState} from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


const ShowFor5Days = (props) => {
    const {
        changeMetricSystem,
        currentPlace,
        appKey,
        unit,
        mode
    } = props;

    const [data5Days, setData5Days] = useState({});
    const [data3Hours, setData3Hours] = useState({});
    const [show, setShow] = useState(false);
    const [detailedData, setDetailedData] = useState({});

    useEffect(() => {
        if (Object.keys(currentPlace).length) {
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&appid=${appKey}`)
                 .then(res => {
                     setData5Days(res.data)
                     axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&appid=${appKey}`)
                         .then(res => {
                             console.log('res.data', res.data);
                             setData3Hours(res.data)
                         }).catch(e => {
                         console.log('error 1', e)
                     })
                 })
                 .catch(e => { console.log(e) });
        } else {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&units=${unit}&appid=${appKey}`)
                    .then(res => {
                        setData5Days(res.data)
                        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.latitude}&units=${unit}&appid=${appKey}`)
                            .then(res => {
                                console.log('res.data', res.data);
                                setData3Hours(res.data)
                            }).catch(e => {
                                console.log('error 1', e)
                            })
                    }).catch(e => {
                        console.log('error 2', e)
                    })
            })
        }
    }, [unit, currentPlace]);

    const epochTimeToDate =(h) => {
        const d = new Date(h * 1000);
        return (
            d.getFullYear()) + "-" +
            ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
            ("00" + d.getDate()).slice(-2);
    }

    const cutMonthFromFullData = (fullData) => {
        const monthData = fullData.slice(0, 10);
        return (monthData);
    }

    const fromDateToHour = (d) => {
        const monthData = d.slice(10,16);
        return monthData;
    }

    const handleClose = () => setShow(false);

    const handleShow = (e) => {
        setShow(true);
        setDetailedData(e)
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
                        {data5Days.daily.map((day, index) => (
                            (index < 5 ?
                                <div className="col-md-2 days-weather" key={uuidv4()}>
                                    <div>
                                        <span className="text-primary">Weather forecast for: </span>
                                        { epochTimeToDate(day.dt) }
                                        <hr />
                                        {Object.keys(data3Hours).length ?
                                            (data3Hours.list.map((hour) => (
                                                (cutMonthFromFullData(hour.dt_txt) === epochTimeToDate(day.dt) ?
                                                    <div key={uuidv4()}>
                                                        <div onClick={() => handleShow(hour.main)} className="weather-detailed-info">
                                                            { fromDateToHour(hour.dt_txt) } - Temp: { Math.round(hour.main.temp) }{mode}
                                                        </div>

                                                        <Modal show={show} onHide={handleClose} className="my-5">
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Detailed info</Modal.Title>
                                                            </Modal.Header>
                                                            {Object.keys(data5Days).length ?
                                                                <Modal.Body>
                                                                    <ol>
                                                                        <li className="details">
                                                                            <span
                                                                                className="text-success">Temperature: </span>
                                                                            {Math.round(detailedData.temp)}{mode}
                                                                        </li>
                                                                        <li className="details">
                                                                            <span className="text-success">Temperature min: </span>
                                                                            {Math.round(detailedData.temp_min)}{mode}
                                                                        </li>
                                                                        <li className="details">
                                                                            <span className="text-success">Temperature max: </span>
                                                                            {Math.round(detailedData.temp_max)}{mode}
                                                                        </li>
                                                                        <li className="details">
                                                                            <span
                                                                                className="text-success">Pressure: </span>
                                                                            {Math.round(detailedData.pressure)} mb
                                                                        </li>
                                                                        <li className="details">
                                                                            <span
                                                                                className="text-success">Sea level: </span>
                                                                            {Math.round(detailedData.sea_level)} mb
                                                                        </li>
                                                                        <li className="details">
                                                                            <span
                                                                                className="text-success">Ground level: </span>
                                                                            {Math.round(detailedData.grnd_level)} mb
                                                                        </li>
                                                                        <li className="details">
                                                                            <span
                                                                                className="text-success">Humidity: </span>
                                                                            {Math.round(detailedData.humidity)} %
                                                                        </li>
                                                                    </ol>
                                                                </Modal.Body>
                                                                : ''
                                                            }
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleClose}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>

                                                    </div>
                                                : ''
                                                )
                                            )))
                                        : ''
                                        }
                                    </div>
                                </div>
                            : '')
                        ))}
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

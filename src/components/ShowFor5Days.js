import {useEffect, useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import LoadingSpinner from './LoadingSpinner';

const ShowFor5Days = (props) => {
    const {
        changeMetricSystem,
        currentPlace,
        appKey,
        unit,
        mode,
        baseHourlyUrl,
        base5DaysUrl
    } = props;

    const [data5Days, setData5Days] = useState({});
    const [data3Hours, setData3Hours] = useState({});
    const [show, setShow] = useState(false);
    const [detailedData, setDetailedData] = useState({});

    useEffect(() => {
        if (Object.keys(currentPlace).length) {
            axios.get(`${baseHourlyUrl}?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&appid=${appKey}`)
                .then(res => {
                    setData5Days(res.data)
                    axios.get(`${base5DaysUrl}?lat=${currentPlace.coord.lat}&lon=${currentPlace.coord.lon}&units=${unit}&appid=${appKey}`)
                        .then(res => {
                            setData3Hours(res.data)
                        }).catch(e => {
                        console.log('current city coordinates are not set', e)
                    })
                }).catch(e => {
                console.log('current place is not set', e)
            });
        } else {
            navigator.geolocation.getCurrentPosition(({coords}) => {
                axios.get(`${baseHourlyUrl}?lat=${coords.latitude}&lon=${coords.longitude}&units=${unit}&appid=${appKey}`)
                    .then(res => {
                        setData5Days(res.data)
                        axios.get(`${base5DaysUrl}?lat=${coords.latitude}&lon=${coords.latitude}&units=${unit}&appid=${appKey}`)
                            .then(res => {
                                setData3Hours(res.data)
                            }).catch(e => {
                            console.log('error 3', e)
                        })
                    }).catch(e => {
                    console.log('error 4', e)
                })
            })
        }
    }, [unit, currentPlace]);

    const epochTimeToDate = (h) => {
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

    const fromDateToHour = (d) => d.slice(10, 16);

    const handleClose = () => setShow(false);

    const handleShow = (e) => {
        setShow(true);
        setDetailedData(e)
    }
    const drawDetailedData = () => {
        return (
            <Modal.Body>
                <ol>
                    <li className="details">
                        <span className="text-success">Temperature: </span>
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
                        <span className="text-success">Pressure: </span>
                        {Math.round(detailedData.pressure)} mb
                    </li>
                    <li className="details">
                        <span className="text-success">Sea level: </span>
                        {Math.round(detailedData.sea_level)} mb
                    </li>
                    <li className="details">
                        <span className="text-success">Ground level: </span>
                        {Math.round(detailedData.grnd_level)} mb
                    </li>
                    <li className="details">
                        <span className="text-success">Humidity: </span>
                        {Math.round(detailedData.humidity)} %
                    </li>
                </ol>
            </Modal.Body>
        )
    }

    const drawHoursList = (hour) => {
        return (
            <div key={uuidv4()}>
                <div onClick={() => handleShow(hour.main)} className="weather-detailed-info">
                    { fromDateToHour(hour.dt_txt) } - Temp: { Math.round(hour.main.temp) }{mode}
                </div>

                <Modal show={show} onHide={handleClose} className="my-5">
                    <Modal.Header closeButton>
                        <Modal.Title>Detailed info</Modal.Title>
                    </Modal.Header>
                    {Object.keys(data5Days).length ?
                        (drawDetailedData())
                        : ''
                    }
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }

    return (
        <>
            {Object.keys(data5Days).length ? (
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
                                        <div className="text-primary">Weather forecast for: </div>
                                        { epochTimeToDate(day.dt) }
                                        <hr />
                                        {Object.keys(data3Hours).length ?
                                            (data3Hours.list.map((hour) => (
                                                (cutMonthFromFullData(hour.dt_txt) === epochTimeToDate(day.dt) ?
                                                        (drawHoursList(hour))
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
                    <LoadingSpinner />
                )
            }
        </>
    );
}

export default ShowFor5Days;

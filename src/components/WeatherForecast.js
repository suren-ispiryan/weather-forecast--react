import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Search from './Search';
import HourlyForecast from './HourlyForecast';
import LoadingSpinner from './LoadingSpinner';
import {v4 as uuidv4} from 'uuid';

const WeatherForecast = (props) => {
    const {
        changeMetricSystem,
        currentPlace,
        setCurrentPlace,
        baseUrl,
        appKey,
        unit,
        mode,
        city,
        setCity,
        errorNoCountry,
        setErrorNoCountry,
        favourite,
        setFavourite,
        epochTimeToDate,
        rise,
        set,
        baseHourlyUrl,
        details
    } = props

    useEffect(() => {
        if (Object.keys(currentPlace).length) {
            epochTimeToDate();
        }
    }, [unit, currentPlace])

    const handleChangeSearchInput = ({ target }) => {
        setCity(target.value);
    }

    return (
        <>
            {Object.keys(currentPlace).length ? (
                <div className="container">
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
                            <hr />
                            <h2 className="text-success">
                                { currentPlace.name }, { currentPlace.sys.country }
                            </h2>
                            <h4 className="text-success">
                                Now { Math.round(currentPlace.main.temp) } { mode }
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
                            <hr />
                            <Table striped bordered hover size="md table">
                                <tbody>
                                    {details.map((i) => (
                                        <tr key={uuidv4()}>
                                            <th>{i.header}</th>
                                            <td>{i.data}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <HourlyForecast
                            baseHourlyUrl={baseHourlyUrl}
                            currentPlace={currentPlace}
                            appKey={appKey}
                            unit={unit}
                            mode={mode}
                        />
                    </div>
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </>
    );
}

export default WeatherForecast;

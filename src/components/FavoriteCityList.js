import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const FavoriteCityList = (props) => {
    const {
        favourite,
        setFavourite,
        baseUrl,
        appKey,
        unit,
        setCurrentPlace,
        setErrorNoCountry,
        epochTimeToDate,
        setFavouriteCity
    } = props;

    const showWeather = (city) => {
        setFavouriteCity(city)
        setErrorNoCountry('')
        axios.get(`${baseUrl}?&units=${unit}&q=${city}&appid=${appKey}`)
            .then(res => {
                setCurrentPlace(res.data)
                setErrorNoCountry('')
                epochTimeToDate();
            }).catch(() => {
                setErrorNoCountry('Sorry, no such a country or city')
            });
    }

    const deleteCity = (cityId) => {
        const removedFavourite = favourite.findIndex(i => i.id === cityId)
        const favouriteCopy = [...favourite]
        favouriteCopy.splice(removedFavourite, 1)
        setFavourite(favouriteCopy)
    }

    return (
        <div className="FavoriteCityList container my-5">
            {favourite.length ?
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Country/City</th>
                        <th>Show weather</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {favourite.map((city, index) =>
                        <tr key={city.id}>
                            <td>{index + 1}</td>
                            <td>{city.city}</td>
                            <td>
                                <Link to="/">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => showWeather(city.city)}
                                    >
                                        Show weather
                                    </button>
                                </Link>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={ () => deleteCity(city.id) }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                :
                <h1 className="text-danger">
                    <LoadingSpinner />
                </h1>
            }
        </div>
    );
}

export default FavoriteCityList;


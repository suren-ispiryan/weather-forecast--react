import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Search = (props) => {
    const {
        errorNoCountry,
        setErrorNoCountry,
        handleChangeSearchInput,
        baseUrl,
        city,
        appKey,
        setCurrentPlace,
        epochTimeToDate,
        unit,
        favourite,
        // setFavourite
    } = props

    const searchCountry = () => {
        axios.get(`${baseUrl}?&units=${unit}&q=${city}&appid=${appKey}`)
            .then(res => {
                setErrorNoCountry('')
                setCurrentPlace(res.data)
                epochTimeToDate();
            })
            .catch(err => { setErrorNoCountry('Sorry, no such a country or city') });
    }

    const favouriteCities = () => {
        axios.get(`${baseUrl}?&units=${unit}&q=${city}&appid=${appKey}`)
            .then(res => {
                const repeatedCity = favourite.filter(i => i.city === city)
                if (repeatedCity.length === 0) {
                    setErrorNoCountry('');
                    // Push favourite cities to local storage
                    const fav = { id: uuidv4(), city: city }
                    if (!localStorage.getItem('favourites')) {
                        localStorage.setItem('favourites', JSON.stringify([fav]));
                    } else {
                        let favourites = JSON.parse(localStorage.getItem('favourites'));
                        let favouriteItem = []
                        for (let i in favourites) {
                            favouriteItem.push(favourites[i])
                        }
                        favouriteItem.push(fav);
                        localStorage.setItem('favourites', JSON.stringify(favouriteItem));
                    }
                    // setFavourite([
                    //     ...favourite,
                    //     {
                    //         id: uuidv4(),
                    //         city: city
                    //     }
                    // ])
                } else {
                    setErrorNoCountry('This city already exist');
                }
            })
            .catch(err => {
                setErrorNoCountry('Sorry, no such a country or city')
            })
    }

    return (
        <>
            <div className="row my-5">
                <div className="col-md-2">
                    <input
                        className="form-control search-country"
                        type="text"
                        onChange={handleChangeSearchInput}
                        placeholder="Type a country"
                    />
                </div>
                <div className="col-md-4">
                    <button
                        className="btn btn-primary"
                        onClick={() =>  searchCountry()}
                    >
                        Search
                    </button>
                    <button
                        className="mx-2 btn btn-primary"
                        onClick={() => favouriteCities()}
                    >
                        add to favourite
                    </button>
                </div>
                <div className="col-md-4 err-country-text text-danger">
                    <h4>{ errorNoCountry ? errorNoCountry : '' }</h4>
                </div>
            </div>
        </>
    );
}

export default Search;

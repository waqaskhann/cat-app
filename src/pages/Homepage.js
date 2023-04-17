import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import './Homepage.scss';

const Homepage = () => {
  const { breed, setBreed } = useContext(AppContext);
  const { lastVisitedWasSingle, setLastVisitedWasSingle } = useContext(AppContext);
  const { cats, setCats } = useContext(AppContext);
  const [breeds, setBreeds] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCats, setLoadedCats] = useState(0);

  useEffect(() => {
    // Fetch all available breeds to populate select
    const fetchBreeds = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/breeds');
        setBreeds(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBreeds();
    setLastVisitedWasSingle(false)
  }, []);


  useEffect(() => {
    // Fetch cats based on breed and page number
    const fetchCats = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_id=${breed}&limit=10&page=${page}`);
        const newCats = response.data.filter(cat => !cats.some(existingCat => existingCat.id === cat.id)); // Filter out duplicates
        setCats(prevCats => [...prevCats, ...newCats]);
        setLoadedCats(prevLoadedCats => prevLoadedCats + newCats.length);
        setIsLoading(false);
      } catch (error) {
        alert("Apologies but we could not load new cats for you at this time! Miau!")        
        setIsLoading(false);
      }
    };

    // Only fetch cats if breed is selected
    if(breed) {
      fetchCats();
    } else if (breed && lastVisitedWasSingle) {

    } else {
      setCats([]);
      setPage(1);
      setLoadedCats(0);
    }
    }, [breed,page]);

  const renderCats = () => {
    if (!breed) {
      return <div>Please select a breed.</div>;
    }

    if (isLoading) {
      return <div>Loading cats...</div>;
    }

    if (cats.length === 0) {
      return <div>No cats found for the selected breed.</div>;
    }

    return cats.map(cat => (
      <div key={cat.id} className="card">
        <figure className="card__img-wrapper">
          <img src={cat.url} alt={`Cat ${cat.id}`} className="card__img"/>
        </figure>
        <Link to={`/cat-app/${cat.id}`} className="card__cta">View details</Link>
      </div>
    ));
  };

  const loadMoreCats = () => {
    setPage(prevPage => prevPage + 1);
  };

  const allCatsLoaded = loadedCats < page * 10;

  const handleBreedChange = (e) => {
    setBreed(e.target.value);
    setCats([]);
    setPage(1);
    setLoadedCats(0);
  };

  return (
    <div className="content-wrapper">
      <h1>Cat browser</h1>
      <select value={breed} onChange={handleBreedChange}>
        <option value="">Select Breed</option>
        {breeds.map(breed => (
          <option key={breed.id} value={breed.id}>{breed.name}</option>
        ))}
      </select>
      <div className="cards">
        {renderCats()}
      </div>
      {!allCatsLoaded &&
        <button onClick={loadMoreCats} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      }
    </div>
  );
};

export default Homepage;
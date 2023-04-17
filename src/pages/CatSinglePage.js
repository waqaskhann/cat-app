import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';


const CatSinglePage = () => {
  const { lastVisitedWasSingle, setLastVisitedWasSingle } = useContext(AppContext);
  const { catId } = useParams();
  const [cat, setCat] = useState(null);

  useEffect(() => {
    // Fetch data based on cat ID
    const fetchCat = async () => {
        try {
        const response = await axios.get(`https://api.thecatapi.com/v1/images/${catId}`);
        setCat(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchCat();

    setLastVisitedWasSingle(true)
  }, [catId]);

  // Render cat data
  const renderCat = () => {
    if (!cat) {
      return <div>Loading cat...</div>;
    }

    return (
      <div>
        <Link to={`/`} className="back-btn">Back to Homepage</Link>
        <div className="cat">
          <figure className="cat__img-wrapper">
            <img className="cat__img" src={cat.url} alt={`Cat ${cat.id}`} />
          </figure>
          <div className="cat__info">
            <h1>{cat.breeds[0].name}</h1>
            <p className="cat__origin">Origin: {cat.breeds[0].origin}</p>
            <p className="cat__temperament">{cat.breeds[0].temperament}</p>
            <p className="cat__description">{cat.breeds[0].description}</p>
          </div>
        </div>
      </div>
    );
  };

  return renderCat();
};

export default CatSinglePage;

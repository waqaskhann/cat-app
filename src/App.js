import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CatSinglePage from './pages/CatSinglePage';

export const AppContext = createContext();

const App = () => {
  const [breed, setBreed] = useState('');
  const [lastVisitedWasSingle, setLastVisitedWasSingle] = useState(false);
  const [cats, setCats] = useState([]);

  return (
    <Router>
      <AppContext.Provider value={{ breed, setBreed, cats, setCats, lastVisitedWasSingle, setLastVisitedWasSingle }}>
        <Routes>
          <Route exact path="/cat-app" element={ <Homepage/> } />
          <Route path="/cat-app/:catId" element={ <CatSinglePage/> } />
        </Routes>
      </AppContext.Provider>
    </Router>
  );
};

export default App;
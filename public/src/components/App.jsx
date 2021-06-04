import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Products from './products/Products.jsx';
import Reviews from './R&R/Reviews.jsx';
import Answers from './Q&A/Answers.jsx';
import Questions from './Q&A/Questions.jsx';
import Navbar from './navigation/NavBar.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`/api/products`)
      .then(({ data }) => {
        dispatch({ type: 'products', products: data });
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get(`/api/reviews`)
      .then(({ data }) => {
        dispatch({ type: 'reviews', reviews: data });
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get(`/api/questions`)
      .then(({ data }) => {
        dispatch({ type: 'questions', questions: data });
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get(`/api/answers`)
      .then(({ data }) => {
        dispatch({ type: 'answers', answers: data });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='products'>
        <Products />
      </div>
      <div className='reviews'>
        <Reviews />
      </div>
      <div className='questions'>
        <Questions />
      </div>
      <div className='answers'>
        <Answers />
      </div>
    </div>
  )
}

export default App;
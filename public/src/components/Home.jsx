import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import NavBar from '../navigation/NavBar.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reviews = useSelector((state) => state.reviewsReducer.reviews);
  // const review = useSelector((state) => state.productIdReducer.review);
  // console.log('REVIEW', review)

  // useEffect(() => {
  //   axios.get(`/api/reviews`)
  //     .then(({ data }) => {
  //       console.log(data)
  //       dispatch({ type: 'review', review: data });
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  useEffect(() => {
    axios.get(`/api/reviews/${review.product_id}`)
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: 'reviews', reviews: data });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogin = () => {
    history.push('/home');
  };

  return (
    <div>
      <h1>Home Page</h1>
      <NavBar />
    </div>
  )
}

export default Home;
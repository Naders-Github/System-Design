import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import ReviewsList from './ReviewsList.jsx';

const Reviews = () => {
  const reviews = useSelector((state) => state.reviewsReducer.reviews);
  console.log(reviews)

  return (
    <div className='reviews'>
      hi
      {reviews.map((review) => (
        <ReviewsList review={review} key={review.id}/>
      ))}
    </div>
  )
}

export default Reviews;
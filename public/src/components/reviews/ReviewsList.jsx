import React from 'react';

const ReviewsList = ({ review }) => (

  <div>
    {review.rating}
    {review.body}
    {review.recommend}
    {review.reported}
    {review.response}
    {review.reviewer_email}
    {review.reviewer_name}
    {review.summary}
  </div>

);

export default ReviewsList;
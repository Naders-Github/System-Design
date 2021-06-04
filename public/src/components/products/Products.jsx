import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

const Products = () => {
  const products = useSelector((state) => state.productsReducer.products);
  console.log(products)

  return (
    <div>
      <h1>Products</h1>
    </div>
  )
};

export default Products;
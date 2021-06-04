const initialState = { review: [] };

const productsReducer = (state = initialState, action) => {
  if (action.type === 'products') {
    return {
      products: action.products
    };
  }
  return state;
};

export default productsReducer;
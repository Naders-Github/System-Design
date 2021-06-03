const initialState = { review: {} };

const productIdReducer = (state = initialState, action) => {
  if (action.type === 'review') {
    return {
      review: action.review
    };
  }
  return state;
};

export default productIdReducer;
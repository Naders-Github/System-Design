const initialState = { questions: [] };

const answersReducer = (state = initialState, action) => {
  if (action.type === 'questions') {
    return {
      questions: action.questions
    };
  }
  return state;
}

module.exports = answersReducer;
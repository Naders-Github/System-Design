const initialState = { questions: [] };

const questionsReducer = (state = initialState, action) => {
  if (action.type === 'questions') {
    return {
      questions: action.questions
    };
  }
  return state;
}

module.exports = questionsReducer;
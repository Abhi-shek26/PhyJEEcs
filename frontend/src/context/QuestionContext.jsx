import { createContext, useReducer } from "react";

export const QuestionContext = createContext();

const questionReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };

    case "ADD_QUESTION":
      return { ...state, questions: [action.payload, ...state.questions] };

    default:
      return state;
  }
};

const initialState = {
  questions: [],
};

export const QuestionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, initialState);

  // Function to add a new question
  const addQuestion = (newQuestion) => {
    dispatch({ type: "ADD_QUESTION", payload: newQuestion });
  };

  return (
    <QuestionContext.Provider value={{ ...state, dispatch, addQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};

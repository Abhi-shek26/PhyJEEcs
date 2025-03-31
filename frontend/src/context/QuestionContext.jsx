import { createContext, useReducer, useState } from "react";

export const QuestionContext = createContext();

const questionReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      const newState = { ...state, questions: action.payload };
      return newState;

    default:
      return state;
  }
};

const initialState = {
  questions: [],
};

export const QuestionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, initialState);

  return (
    <QuestionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </QuestionContext.Provider>
  );
};

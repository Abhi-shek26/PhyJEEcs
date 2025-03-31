import { useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";

export const useQuestionContext = () => {
  return useContext(QuestionContext);
};

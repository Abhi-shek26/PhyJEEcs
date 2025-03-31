import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthContextProvider>
    <QuestionProvider>
      <App />
    </QuestionProvider>
  </AuthContextProvider>
  // </StrictMode>,
);

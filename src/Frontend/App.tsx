import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./components/Login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

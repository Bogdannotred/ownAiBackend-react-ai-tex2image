import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, loading] = useAuthState(auth);
    console.log("User:", user); // Log the user object to see its properties
  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;

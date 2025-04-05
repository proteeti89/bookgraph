import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <button onClick={handleLogin} className="p-2 bg-blue-600 text-white rounded">
      Sign in with Google
    </button>
  );
}

import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { Button } from "@mantine/core"

interface LoginButtonProps {
  onLogin: (email: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user.email!); // Pass the email back to parent
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return <Button onClick={handleLogin}>Login with Google</Button>;
};

export default LoginButton;

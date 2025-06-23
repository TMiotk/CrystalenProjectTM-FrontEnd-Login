import { useState, useEffect, ChangeEvent } from "react";
import "./App.css";

type LoginResponse = {
  message: string;
};

const EMAIL_DOMAIN = "@crystalenproject.com";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isCompanyEmail = (email: string): boolean =>
  email.toLowerCase().endsWith(EMAIL_DOMAIN);

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      setMessage("Invalid email format");
      return;
    }
    if (!isCompanyEmail(trimmedEmail)) {
      setMessage(`Only company emails allowed (${EMAIL_DOMAIN})`);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      if (!res.ok) {
        setMessage(`Server error (${res.status})`);
        return;
      }
      const data: LoginResponse = await res.json();
      setMessage(data.message);
      if (data.message === "Firma Crystalen Project TM pozdrawia !") {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      } else {
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
      }
    } catch {
      setMessage("Backend is not available. Please try again later.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="login-header">
      <div className="login-panel">
        {isLoggedIn ? (
          <>
            <StatusMessage message="You are logged in ✅" />
            <ActionButton onClick={handleLogout} label="Logout" />
          </>
        ) : (
          <>
            <EmailInput value={email} onChange={setEmail} />
            <ActionButton onClick={handleLogin} label="Login" />
          </>
        )}
        {message && <ErrorMessage message={message} />}
      </div>
    </div>
  );
}

type EmailInputProps = {
  value: string;
  onChange: (val: string) => void;
};

function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <input
      type="email"
      value={value}
      placeholder="Enter your email"
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}

type ActionButtonProps = {
  onClick: () => void;
  label: string;
};

function ActionButton({ onClick, label }: ActionButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className="login-error">{message}</div>;
}

type StatusMessageProps = {
  message: string;
};

function StatusMessage({ message }: StatusMessageProps) {
  return <p>{message}</p>;
}

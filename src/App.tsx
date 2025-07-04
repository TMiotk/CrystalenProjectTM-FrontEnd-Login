// Copyright © Tomasz Miotk, Crystalen Project TM.
// This code is proprietary and for viewing purposes only.
// Copying, editing, or distributing any part of this code
// is strictly prohibited without explicit permission from the author.

import { useState, useEffect, ChangeEvent } from "react";
import "./App.css";
import Welcome from "./components/Welcome";

type LoginResponse = {
  message: string;
  token?: string;
  email?: string;
  expiration?: number;
};

const EMAIL_DOMAIN = "@crystalenproject.com";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isCompanyEmail = (email: string): boolean =>
  email.toLowerCase().endsWith(EMAIL_DOMAIN);

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [accepted, setAccepted] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    document.title = isLoggedIn
      ? "Welcome in Crystalen Project TM system!"
      : "Nice to see you here , please log in";
  }, [isLoggedIn]);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!accepted) {
      setMessage("You must accept the terms to log in.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setMessage("Invalid email format");
      return;
    }
    if (!isCompanyEmail(trimmedEmail)) {
      setMessage(`Only company emails allowed (${EMAIL_DOMAIN})`);
      return;
    }
    if (!trimmedPassword) {
      setMessage("Password is required");
      return;
    }
    try {
      const res = await fetch("https://localhost:8443/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });
      if (!res.ok) {
        setMessage(`Server error (${res.status})`);
        return;
      }
      const data: LoginResponse = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setEmail("");
        setPassword("");
        setMessage(""); // clear message after successful login
      } else {
        setIsLoggedIn(false);
        setMessage(data.message || "Login failed");
      }
    } catch {
      setMessage("Backend is not available. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  return (
    <div className="login-header">
      <div className="login-panel">
        {isLoggedIn ? (
          <>
            <StatusMessage message="You are logged in ✅" />
            <ActionButton onClick={handleLogout} label="Logout" />
            <Welcome />
            <p className="welcome-text">
              Welcome to the Crystalen Project TM! Enjoy your stay.
            </p>
          </>
        ) : (
          <>
            <EmailInput value={email} onChange={setEmail} />
            <PasswordInput value={password} onChange={setPassword} />
            <div
              style={{ display: "flex", alignItems: "center", margin: "8px 0" }}
            >
              <input
                type="checkbox"
                id="accept"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <label htmlFor="accept" style={{ marginRight: 8 }}>
                I accept the terms
              </label>
              {/* <FaInfoCircle
                style={{ cursor: "pointer" }}
                title="Click for more info"
                onClick={() => setShowInfo((v) => !v)}
              /> */}
            </div>
            {showInfo && (
              <div
                style={{ fontSize: "0.95em", color: "#555", marginBottom: 8 }}
              >
                To log in, you must accept the terms of use for Crystalen
                Project TM.
              </div>
            )}
            <ActionButton onClick={handleLogin} label="Login" />
            {message && <ErrorMessage message={message} />}
          </>
        )}
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

type PasswordInputProps = {
  value: string;
  onChange: (val: string) => void;
};

function PasswordInput({ value, onChange }: PasswordInputProps) {
  return (
    <input
      type="password"
      value={value}
      placeholder="Enter your password"
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

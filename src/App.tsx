import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setMessage("Invalid email format");
      return;
    }

    if (!email.toLowerCase().endsWith("@crystalenproject.com")) {
      setMessage("Only company emails allowed (@crystalenproject.com)");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setMessage(`Server error (${res.status})`);
        return;
      }

      const data = await res.json();

      setMessage(data.message);

      if (data.message === "Firma Crystalen Project TM pozdrawia !") {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      } else {
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
      }
    } catch (error) {
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
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      {isLoggedIn ? (
        <>
          <p>You are logged in ✅</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;

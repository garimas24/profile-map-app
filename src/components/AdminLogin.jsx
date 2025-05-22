import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdminLoggedIn, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("adminUser"));
    if (savedUser?.username) {
      setUsername(savedUser.username);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulate auth delay
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const userData = { username };
        localStorage.setItem("adminUser", JSON.stringify(userData));

        setIsAdminLoggedIn?.(true);
        onLoginSuccess?.();

        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>🔒 Admin Login</h2>

        <label htmlFor="username" style={styles.label}>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
          }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: 10,
    marginBottom: 18,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
    outlineColor: "#007bff",
  },
  button: {
    padding: 12,
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "#dc3545",
    marginBottom: 12,
    fontSize: 14,
  },
};

export default AdminLogin;

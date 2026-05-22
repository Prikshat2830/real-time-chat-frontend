import styles from "./Login.module.css";
import { useState, useContext } from "react";
import { loginAPI } from "../../services/Api.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handle = async () => {
    const data = await loginAPI(form);
    if (data.token) {
        login(data);
        navigate("/home");
    } else {
        alert("Invalid credentials");
    }
    };

    return (
    <div className={styles.container}>
        <div className={styles.box}>
            <h2>Login</h2>

        <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handle}>Login</button>
        <p>If you don't have an account <Link className={styles.link} to={"/"}>Register</Link></p>
        </div>
    </div>
    );
}
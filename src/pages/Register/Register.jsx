import styles from "./Register.module.css";
import { useState } from "react";
import { registerAPI } from "../../services/Api.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: ""})

    const navigate = useNavigate()

    const handleHome = async () => {
        const data = await registerAPI(form)
        if (data.token) {
            alert("Registration Successfull")
            navigate("/home")
        } else {
            alert("Registeration Failed")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2>Register</h2>

                <input placeholder="Enter Your Name" onChange={(e) => setForm({...form,name:e.target.value})} required/>
                <input placeholder="Enter Your Email" onChange={(e) => setForm({...form,email:e.target.value})} required/>
                <input type="password" placeholder="Enter Your Password" onChange={(e) => setForm({...form,password:e.target.value})} required/>

                <button onClick={handleHome}>Register</button>
                <p>Already have an account? <Link className={styles.link} to={"/login"}>Login</Link></p>
            </div>
        </div>
    )
}
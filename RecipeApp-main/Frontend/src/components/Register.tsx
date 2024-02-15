/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/auth";
import { RegisterRequest } from "../types";
import { Alert } from "react-bootstrap";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [show, setShow] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [alertKey, setAlertKey] = React.useState<number>(0);
    const [alertVariant, setAlertVariant] = React.useState<string>("success");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call the onLogin function passed from the parent component

        if (!email || !password || !name || !phone) {
            alert("Please enter required details.");
            return false;
        }

        try {
            const request: RegisterRequest = {
                name: name,
                email: email,
                password: password,
                phone: phone
            };
            const data = await register(request);
            if (data) {
                console.log(data);
                setMessage("User registered sucessfully! Click on Login tab.");
                setAlertVariant("success");
                setAlertKey(1);
                setShow(true);
            }
            else {
                setMessage("Something went wrong!");
                setAlertVariant("danger");
                setAlertKey(1);
                setShow(true);
            }
        }
        catch (error: any) {
            const msg = JSON.parse(error.message);
            setMessage(msg.message.toString());
            setAlertVariant("danger");
            setAlertKey(1);
            setShow(true);
        }
    };


    return (

        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                    <div className="card mb-3">

                        <div className="card-body">

                            <div className="pt-4 pb-2">
                                <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                <p className="text-center small">Enter your personal details to create account</p>
                            </div>
                            <div className="pt-4 pb-2">
                                {show && alertKey !== 0 &&
                                    (
                                        <Alert key={alertKey}
                                            variant={alertVariant}
                                            onClick={() => {
                                                setShow(false);
                                                setAlertKey(0);
                                                setAlertVariant("");
                                            }}
                                            show={show}
                                            dismissible
                                        >
                                            {message}
                                        </Alert>
                                    )}
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="col-12 form-group">
                                    <label htmlFor="yourName" className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        id="yourName"
                                        onChange={e => setName(e.target.value)}
                                        required />
                                    <div className="invalid-feedback">Please, enter your name!</div>
                                </div>

                                <div className="col-12 form-group">
                                    <label htmlFor="yourEmail" className="form-label">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        id="yourEmail"
                                        onChange={e => setEmail(e.target.value)}
                                        required />
                                    <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                </div>

                                <div className="col-12 form-group">
                                    <label htmlFor="yourPassword" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        id="yourPassword"
                                        onChange={e => setPassword(e.target.value)}
                                        required />
                                    <div className="invalid-feedback">Please enter your password!</div>
                                </div>
                                <div className="col-12 form-group">
                                    <label htmlFor="yourContact" className="form-label">Your Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        id="yourContact"
                                        onChange={e => setPhone(e.target.value)}
                                        required />
                                    <div className="invalid-feedback">Please enter your contact!</div>
                                </div>
                                <div className="col-12 form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" name="terms" type="checkbox" value="" id="acceptTerms" required />
                                        <label className="form-check-label" htmlFor="acceptTerms">I agree and accept the <a href="#">terms and conditions</a></label>
                                        <div className="invalid-feedback">You must agree before submitting.</div>
                                    </div>
                                </div>
                                <div className="col-12 form-group">
                                    <button className="btn btn-primary w-100" type="submit">Create Account</button>
                                </div>
                                <div className="col-12 form-group">
                                    <p className="small mb-0">Already have an account? <Link to="/login">Sign In</Link></p>
                                </div>
                            </form>


                        </div>
                    </div>

                </div>
            </div>
        </div>


    );
}

export default Register;
import { RegisterFlow } from "@/flows/register";
import React, { useState } from "react";

type ICcontentRegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  password: string;
};

const initialContentRegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  password: "",
};

const url = process.env.NEXT_PUBLIC_ROUTE;

const Register = () => {
  const [contentRegisterForm, setContentRegisterForm] =
    useState<ICcontentRegisterForm>(initialContentRegisterForm);

  const handleRegisterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setContentRegisterForm({ ...contentRegisterForm, [name]: value });
  };

  const handleRegisterFormSubmit = (e: any) => {
    e.preventDefault();

    console.log("contentRegisterForm", contentRegisterForm);

    RegisterFlow.registerNewUser(contentRegisterForm);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegisterFormSubmit}>
        <input
          onChange={handleRegisterFormChange}
          name="firstName"
          placeholder="firstName"
        />
        <input
          onChange={handleRegisterFormChange}
          name="lastName"
          placeholder="lastName"
        />
        <input
          onChange={handleRegisterFormChange}
          name="email"
          placeholder="email"
        />
        <input
          onChange={handleRegisterFormChange}
          type="number"
          name="age"
          placeholder="age"
        />

        <input
          onChange={handleRegisterFormChange}
          type="password"
          name="password"
          placeholder="password"
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

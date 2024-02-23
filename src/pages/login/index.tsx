import { RegisterFlow } from "@/flows/register";
import React, { useState } from "react";

interface IForm {
  email: string;
  password: string;
}

const initialFormValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [inputs, setInputs] = useState<IForm>(initialFormValues);
  const handleLogin = (e: any) => {
    e.preventDefault();

    RegisterFlow.loginUser(inputs);
  };

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          value={inputs.email}
          name="email"
          onChange={handleInputsChange}
          placeholder="email"
        />
        <input
          value={inputs.password}
          name="password"
          onChange={handleInputsChange}
          placeholder="password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

import React from "react";
import { useState, useRef } from "react";
const Signup = () => {
  const fNameRef = useRef();
  const lNameRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [err, setErr] = useState("");
  const callSignupApi = async (fName, lName, username, password) => {
    const response = await fetch("http://localhost:3000/api/v1/user/signup", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: fName,
        lastName: lName,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const jsonResp = await response.json();
    return jsonResp;
  };
  const handleSubmit = async (e) => {
    const res = await callSignupApi(
      fNameRef.current.value,
      lNameRef.current.value,
      userNameRef.current.value,
      passwordRef.current.value
    );
    const jsonResponse = await res;
    if (!jsonResponse?.token) {
      setErr(jsonResponse?.message);
    }

    e.preventDefault();
  };
  return (
    <div className="bg-gray-300 h-screen w-screen flex justify-center items-center">
      <div className="w-1/4 h-3/4 bg-white rounded-lg">
        <div>
          <p className="mt-2 text-3xl font-bold text-center">Sign Up</p>
          <p className="mt-2 text-center text-gray-500 text-lg">
            Enter Your information to Create an account
          </p>
        </div>
        <div>
          <div className="ml-4 mt-6">
            <p className="font-semibold mt-3">First Name</p>
            <input
              placeholder="Enter First Name"
              ref={fNameRef}
              className="p-2 mt-2  border-2 w-3/4 "
            ></input>
            <p className="font-semibold mt-3">Last Name</p>
            <input
              placeholder="Enter Last Name"
              ref={lNameRef}
              className="p-2 mt-2  border-2 w-2/3 "
            ></input>
            <p className="font-semibold mt-3">Username</p>
            <input
              ref={userNameRef}
              placeholder="Enter Username"
              className="p-2 mt-2  border-2 w-2/3 "
            ></input>
            <p className="font-semibold mt-3">Password</p>
            <input
              placeholder="Enter Password"
              ref={passwordRef}
              className="p-2 mt-2  border-2 w-2/3 "
            ></input>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="text-center m-2 p-2 mt-3 mx-5 bg-black text-white"
        >
          Sign Up
        </button>
        {err && <p className="w-1/4 text-red">{err}</p>}
      </div>
    </div>
  );
};

export default Signup;

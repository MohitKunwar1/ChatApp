import React from "react";

const Input = ({ type, name, id, placeholder, style, values, setValues}) => {
  return (
    <>
      <input
        type={type}
        values={values}
        onChange={(e) => setValues(val => ({...val, [name]: e.target.value}))}
        name={name}
        id={id}
        placeholder={placeholder}
        className={`outline-none bg-transparent border-b-[1px] mb-[1rem] ${style}`}
      />
    </>
  );
};

export default Input;

import React from "react";

const Input = ({ id, type, label }) => (
    <input className="form-group__input" type={type} id={id} placeholder={label} required />
);

export default Input;

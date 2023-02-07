import React from "react";

interface Props {
  type: string;
  placeholder: string;
  style: string;
  event: (value: string) => void;
}

const Input: React.FC<Props> = ({ type, placeholder, style, event }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={style}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        event(e.currentTarget.value)
      }
    ></input>
  );
};

export default Input;

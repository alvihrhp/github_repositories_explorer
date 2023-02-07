import React from "react";

interface Props {
  type: "button" | "submit" | "reset" | undefined;
  name: string;
  style: string;
}

const Button: React.FC<Props> = ({ type, name, style }) => {
  return (
    <button type={type} className={style}>
      {name}
    </button>
  );
};

export default Button;

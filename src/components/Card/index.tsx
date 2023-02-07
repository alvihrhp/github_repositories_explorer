import React from "react";

interface Props {
  children: React.ReactNode;
  style: string;
}

const Card: React.FC<Props> = ({ children, style }) => {
  return <div className={`shadow-lg rounded h-auto ${style}`}>{children}</div>;
};

export default Card;

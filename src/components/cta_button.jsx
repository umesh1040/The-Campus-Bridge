import React from "react";
import { Link } from "react-router-dom";
export default function CTAButton({
  title,
  message,
  message2,
  buttonText,
  link,
  color,
  onHover,
  handleButtonHover,
}) {
  let callOnHover = (color) => {
    handleButtonHover(color);
  };

  return (
    <div
      className="m-1 group/hero-product flex flex-col items-center p-6 md:pr-10 md:pl-10 md:p-8 cursor-default bg-white/5 backdrop-blur transition rounded-lg first:rounded-l-[40px] last:rounded-r-[40px] hover:scale-[1.02] hover:bg-white/10"
      onMouseEnter={() => callOnHover(color)}
      onMouseLeave={() => callOnHover("bg-emerald-500")}
      style={{
        margin: "0.25rem",
        padding: "1.5rem",
        cursor: "default",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        transition: "transform 0.3s, background-color 0.3s",
        borderRadius: "1rem",
        borderLeftRadius: "40px",
        borderRightRadius: "40px",
      }}
    >
      <h3
        className="flex items-center gap-1 text-zinc-50 font-display text-2xl font-medium leading-none"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          color: "#f0f0f0",
          fontFamily: "sans-serif",
          fontSize: "1.5rem",
          fontWeight: "500",
          lineHeight: "1.25",
        }}
      >
        <span>{title}</span>
      </h3>
      <p
        className="mt-2 opacity-60 text-zinc-300"
        style={{
          marginTop: "0.5rem",
          opacity: "0.6",
          color: "#f0f0f0",
          fontFamily: "sans-serif",
          fontSize: "1rem",
        }}
      >
        {message} 
      </p>
      <Link to={`${link}/${message2}`}>
      <div
        className={`group/link-new inline-flex cursor-pointer items-center transition gap-1 px-5 py-2 rounded-full bg-zinc-50 ${onHover} hover:text-zinc-300 disabled:bg-white/5 disabled:text-zinc-50 mt-4  text-zinc-950`}
        style={{
          display: "inline-flex",
          cursor: "pointer",
          alignItems: "center",
          transition: "0.3s",
          gap: "0.25rem",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          backgroundColor: "#f0f0f0",
          color: "#121212",
          fontFamily: "sans-serif",
          fontSize: "1rem",
        }}
      >
        <span>{buttonText}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          className="inline-flex shrink-0 text-xl ml-auto opacity-60"
          style={{
            width: "1.5rem",
            height: "1.5rem",
            color: "currentColor",
            flexShrink: "0",
            marginLeft: "auto",
            opacity: "0.6",
          }}
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
      </Link>
    </div>
  );
}

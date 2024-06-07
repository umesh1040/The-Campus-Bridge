import { useState } from "react";
import CTAButton from "../../components/cta_button";
import { Box, Container } from "@chakra-ui/react";

const Landing = () => {
  let currentButton = "first";
  const [bgColor, setBgColor] = useState("green");

  const handleButtonHover = (colorClass) => {
    setBgColor(colorClass);
  };

  const buttons = [
    {
      title: "Sign In",
      message: "Unlock Limitless Learning",
      message2: "Log in",
      buttonText: "SignIn",
      link: "/auth",
      color: "red",
      onHover: "hover:red",
      handleButtonHover: handleButtonHover,
    },
    {
      title: "Know More",
      message: "Ignite Your Curiosity",
      buttonText: "Know More",
      message2: "Log in",
      link: "/auth",
      color: "blue",
      onHover: "hover:blue",
      handleButtonHover: handleButtonHover,
    },
    {
      title: "Sign Up",
      message: "Embark on Your Journey",
      buttonText: "SignUp",
      message2: "SignUp",
      link: "/auth",
      color: "purple",
      onHover: "hover:purple",
      handleButtonHover: handleButtonHover,
    },
  ];

  return (
    <Container maxW={"container.lg"} justifyContent="center" alignItems="center">
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-50%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <Box overflow={"clip"} background={"#0B0C11"} mt={5} justifyContent={"center"}>
        <Box style={{ fontSize: "1.25rem", color: "green" }}>The Campus Bridge</Box>
        <Box
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "0",
            height: "400px",
            width: "100%",
            backgroundColor: bgColor,
            opacity: "0.2",
            filter: "blur(200px)",
          }}
        ></Box>
        <Box
          style={{
            paddingTop: "6rem",
            fontSize: "5rem",
            color: "#ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box style={{ fontSize: "4.625rem", fontWeight: "lighter", display: "flex", flexDirection: "row", animation: "slideIn 3s forwards" }}>
            Join the
            <Box style={{ color: "green" }}>&nbsp;new</Box>
          </Box>
          <Box style={{ paddingTop: "2.5rem", fontWeight: "bold", fontSize: "5.625rem", animation: "slideIn 3s forwards" }}>Era of learning</Box>
        </Box>
        <Box
          justifyContent={"center"}
          flexDirection={{ base: "column", md: "row" }}
          style={{ paddingTop: "5rem", display: "flex" }}
        >
          {buttons.map((button) => (
            <CTAButton key={button.buttonText} {...button}></CTAButton>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Landing;

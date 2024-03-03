import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";

const baseColors = {
  darkProtanopia: {
    50: "#F0F0F0",
    100: "#D9D9D9",
    200: "#BFBFBF",
    300: "#A6A6A6",
    400: "#8C8C8C",
    500: "#737373",
    600: "#595959",
    700: "#404040",
    800: "#262626",
    900: "#0D0D0D",
  },
  deuteranopia: {
    50: "#F2F5F0",
    100: "#D6E1CC",
    200: "#B9CEA7",
    300: "#9CB984",
    400: "#7FA660",
    500: "#62923B",
    600: "#4A7329",
    700: "#345219",
    800: "#1D2A09",
    900: "#050B00",
  },
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode("#0A0C10", "#0A0C10")(props), 
      color: "#FFFFFF",
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config, styles, colors: { ...baseColors } });

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);

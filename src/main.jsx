import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { ChatContextProvider as ChatContextGroup } from "./context/ChatContextGroup";
import {ChatContextProvider as ChatContextCommunity } from "./context/ChatContextCommunity";


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

const theme = extendTheme({ config, styles});

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider> 
  <ChatContextProvider>
    <ChatContextCommunity>
    <ChatContextGroup>
    <StrictMode>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </StrictMode>  
    </ChatContextGroup>
    </ChatContextCommunity> 
    </ChatContextProvider>
  </AuthContextProvider>
);

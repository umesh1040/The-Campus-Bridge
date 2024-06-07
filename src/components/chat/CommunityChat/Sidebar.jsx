import React from "react";
import { Box,Text } from "@chakra-ui/react"; // Import Chakra UI components as needed
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <Box flexDirection="column" display={"flex"} border={"1px solid #7A828E"}  borderLeftRadius={5} width={"30%" } height={"96.5%"} >
      <Text fontSize={"1.05em"} align={"center"} padding={2} borderBottom={"1px solid black"}>Welcome to The Campus Bridge Community</Text>
      <Chats />
    </Box>
  );
};

export default Sidebar;

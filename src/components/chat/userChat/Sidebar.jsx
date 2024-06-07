import React from "react";
import { Box } from "@chakra-ui/react"; // Import Chakra UI components as needed
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <Box flexDirection="column" display={"flex"} border={"1px solid #7A828E"}  borderLeftRadius={5} width={"30%" } height={"96.5%"}>
      <Search />
      <Chats />
    </Box>
  );
};

export default Sidebar;

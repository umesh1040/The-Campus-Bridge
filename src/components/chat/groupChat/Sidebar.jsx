import React from "react";
import { Box,Flex } from "@chakra-ui/react"; // Import Chakra UI components as needed
import CreateGroup from "./CreateGroup";
import Chats from "./Chats";
import Search from "./Search";
const Sidebar = () => {
  return (
    <Box flexDirection="column" display={"flex"} border={"1px solid #7A828E"}  borderLeftRadius={5} width={"30%" } height={"96.5%"} overflowY={"scroll"}>
     <Flex direction="row" borderBottom="1px solid #7A828E" >
     <Search/> <CreateGroup />
     </Flex>
      <Chats />
    </Box>
  );
};

export default Sidebar;

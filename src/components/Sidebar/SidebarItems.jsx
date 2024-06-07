import CreatePost from "./CreatePost";
import Home from "./Home";
import Query from "./Query";
import Chat from "./Chat";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Study from "./Study";

import { Box, Button, Divider, Flex, Link, Tooltip } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import React from "react";

const SidebarItems = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  return (
    <Flex alignItems={"center"} gap={{md:2}} 
		  justifyContent="center">
      <Home selected={"home"} />
      <Search selected={"search"} />
      <Query selected={"query"} />
      <Chat selected={"chat"} />
      <Study selected={"study"} />
      <CreatePost selected={"createPost"} />
      <ProfileLink selected={"profileLink"} />

      <Tooltip
        hasArrow
        label={"Logout"}
        placement='right'
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          onClick={handleLogout}
          alignItems={"center"}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <BiLogOut size={25} />
        </Flex>
      </Tooltip>
    </Flex>
  );
};

export default SidebarItems;

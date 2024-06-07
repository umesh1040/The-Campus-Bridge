import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
const ProfileTabs = ({ onSelectTab }) => {
  const [selectedTab, setSelectedTab] = useState("posts");

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    onSelectTab(tabName);
  };

  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Flex
        borderBottom= {selectedTab ==="posts" ? "2px solid #2196F3" :""}
        alignItems={"center"}
        p="3" 
        gap={1}
        cursor={"pointer"}
        onClick={() => handleTabClick("posts")}
        color={selectedTab === "posts" ? "blue.500" : ""}
      >
        <BsGrid3X3 />
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Posts
        </Text>
      </Flex>

      <Flex
        borderBottom= {selectedTab ==="info" ? "2px solid #2196F3" :""}
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
        onClick={() => handleTabClick("info")}
        color={selectedTab === "info" ? "blue.500" : ""}
      >
        <FaInfoCircle />
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Info
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileTabs;

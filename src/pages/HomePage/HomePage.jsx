import React, { useState, useEffect } from "react";
import { Box, Container, Flex, Button,Text } from "@chakra-ui/react";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  const [feedType, setFeedType] = useState("new");

  useEffect(() => {
    const storedFeedType = localStorage.getItem("homeValue");
    if (storedFeedType) {
      setFeedType(storedFeedType);
    }
  }, []);

  const handleFeedTypeChange = (type) => {
    setFeedType(type);
    localStorage.setItem("homeValue", type);
  };

  if (!authUser) {
    navigate("/auth");
    return null;
  }

  return (
    <Container maxW={"container.lg"} justifyContent="center" alignItems="center">
      <Flex gap={1}>
        <Box flex={2} py={10}>
          <Flex justifyContent="center" mt={12} align={"center"} gap={{ base: 2, md: 5 }} > 
            <Button
              fontSize={12} 
              width={{ base: "70px", md: "95px" }} 
              border={"1px solid #7A828E"}
              bg={feedType === "following" ? "gray.800" : "transparent"}
              borderColor={feedType === "following" ? "green.300" : ""}
              onClick={() => handleFeedTypeChange("following")} 
              padding={5}
            >
              Following
            </Button>
            <Button
              fontSize={14}
              width={{ base: "70px", md: "95px" }} 
              border={"1px solid #7A828E"}
              bg={feedType === "new" ? "gray.800" : "transparent"}
              borderColor={feedType === "new" ? "green.300" : ""}
              onClick={() => handleFeedTypeChange("new")} 
              padding={5}
            >
              New
            </Button>
            <Button
              fontSize={12}
              width={{ base: "70px", md: "95px" }} 
              border={"1px solid #7A828E"}
              bg={feedType === "colleges" ? "gray.800" : "transparent"}
              borderColor={feedType === "colleges" ? "green.300" : ""}
              onClick={() => handleFeedTypeChange("colleges")} 
              padding={5}
            >
              Colleges
            </Button>
            <Button
              fontSize={12}
              width={{ base: "70px", md: "95px" }} 
              border={"1px solid #7A828E"}
              bg={feedType === "all" ? "gray.800" : "transparent"}
              borderColor={feedType === "all" ? "green.300" : ""}
              onClick={() => handleFeedTypeChange("all")} 
              padding={5}
            >
              All
            </Button>
          </Flex> 
            <FeedPosts feedType={feedType} /> 
        </Box>

        <Box
          flex={3}
          mr={20}
          mt={20}
          display={{ base: "none", lg: "flex" }}
          maxW={"15%"}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
      <Box
        justifyContent="center"
        alignItems="center"
        flex={3}
        mt={-20}
        display={{ base: "flex", lg: "none" }}
        maxW={"100%"}
      >
        <SuggestedUsers />
      </Box>
    </Container>
  );
};

export default HomePage;

import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import React from "react";
import { Link,useParams } from "react-router-dom";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";

const ProfileHeader = () => {
  // const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username } = useParams();
  const { userProfile } = useGetUserProfileByUsername(username);

  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;  
  return (
    <>
      <Flex gap={{ base: 4, sm: 10 }}  direction={{ base: "column", sm: "row" }} mb={-20} mt={-50} padding={5} minH={250} >
        <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
          <Avatar src={userProfile.profilePicURL} alt='As a programmer logo' />
        </AvatarGroup>

        <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1} maxW={80} >
          <Flex
            gap={4}
            direction={{ base: "column", sm: "row" }}
            justifyContent={{ base: "center", sm: "flex-start" }}
            alignItems={"center"}
            w={"full"}
          >
            <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>
            {visitingOwnProfileAndAuth && (
              <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <Button
                  bg={"#525964"}
                  color={"white"}
                  _hover={{ bg: "gray.800" }}
                  size={{ base: "xs", md: "sm" }}
                  onClick={onOpen}
                >
                  Edit Profile
                </Button>
              </Flex>
            )}
            {visitingAnotherProfileAndAuth && (
              <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <Button
                  bg={"blue.500"}
                  color={"white"}
                  _hover={{ bg: "blue.600" }}
                  size={{ base: "xs", md: "sm" }}
                  onClick={handleFollowUser}
                  isLoading={isUpdating}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </Flex>
            )}
          </Flex>

          <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              <Text as='span' fontWeight={"bold"} mr={1}>
                {userProfile.posts.length}
              </Text>
              Posts
            </Text>

            <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}  overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Link to={`/users/${userProfile.username}?tab=followers`}  width="100%" ml="auto">
              <Button
                size="xs"
                colorScheme="blue" > Followers: {userProfile.followers.length} 
              </Button>    
            </Link>
              
            <Link to={`/users/${userProfile.username}?tab=following`}  width="100%" mx={10}>
              <Button
                size="xs"
                colorScheme="blue"
              >  
              Following: {userProfile.following.length} 
              </Button>
              </ Link>
            </Flex>
          </Flex>

          <Flex direction={"column"} gap={1} width={"full"} alignItems={"start"} >
            <Text fontSize={"sm"} fontWeight={"bold"}  overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              {userProfile.fullName}
            </Text>
            <Text fontSize={"sm"} maxW="100%"  fontWeight={"bold"}  overflow="hidden" whiteSpace="break-spaces" textOverflow="ellipsis">
              {userProfile?.collegeName}
            </Text>
            <Text fontSize={12} fontWeight={"bold"}  overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              {userProfile?.department}
            </Text>
          </Flex>
          <Text maxW="70%" fontSize={"sm"}>{userProfile.bio}</Text>
          <br></br>
        </VStack>
        {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
      </Flex>
    </>
  );
};

export default ProfileHeader;

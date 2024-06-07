import { Avatar, Box, Button, Flex, VStack,GridItem } from "@chakra-ui/react";
import useFollowerUser from "../../../hooks/useFollowerUser";
import useFollowUser from "../../../hooks/useFollowUser";
import useAuthStore from "../../../store/authStore";
import { Link, useParams } from "react-router-dom";

const FollowersUser = ({ user }) => {
  const { isFollower, isUpdating, handleFollowerUser,userProfile } = useFollowerUser(user.uid);
	const { isFollowing,  handleFollowUser } = useFollowUser(user.uid);
  const authUser = useAuthStore((state) => state.user);
  
  const onFollowerUser = async () => {
    await handleFollowerUser();
  };
	const onFollowUser = async () => {
		await handleFollowUser();
	};
  return ( 
    <GridItem
		  cursor={"pointer"}
		  borderRadius={4}
		  overflow={"hidden"}
		  border={"1px solid"}
		  borderColor={"#7A828E"} 
		  position={"relative"}
		  aspectRatio={1 / 1} 
			width={250}
			height={390}
		>
    <Flex gap={5} alignItems={"center"}  w={"full"} h={"full"}   direction={"column"}>
      <Flex alignItems={"center"} justifyContent={"center"} gap={2} width={80} direction={"column"} >
        <Flex background={"#1F2937"}  width={"100%"} justifyContent={"center"} >
        <Link to={`/${user.username}`} >
          <Avatar src={user.profilePicURL} size={"2xl"} mt={25} mb={25}/>
        </Link>
        </Flex>
        <VStack spacing={2}  >
          <Link to={`/${user.username}`}>
            <Box fontSize={18} fontWeight={"bold"} textAlign={"center"} pl={5} pr={5} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
              {user.fullName}
            </Box>
          </Link>
          <Box fontSize={12} color={"gray.500"}>
            {user.followers.length} followers
          </Box>
          <Box height={14} fontSize={16} color={"gray.500"} textAlign={"center"} pl={5} pr={5} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
            {user.collegeName} 
          </Box>
          <Box height={6} fontSize={14} color={"gray.500"} textAlign={"center"} pl={5} pr={5} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
            {user.department} 
          </Box>
        </VStack>
      </Flex>
      <Flex direction={"row"} gap={5} mr={10} width={50} > 
       	{authUser.uid === userProfile.uid &&  <Button
          fontSize={13}
          bg={"transparent"}
          p={0}
          h={"max-content"}
          fontWeight={"medium"}
          color={"blue.400"}
          cursor={"pointer"}
          _hover={{ color: "white" }}
          onClick={onFollowerUser}
          isLoading={isUpdating} 
          mb={"auto"}
        >
          Remove
        </Button>
        }

        {authUser.uid !== user.uid && (
				<Button
					fontSize={13}
					bg={"transparent"}
					p={0}
					h={"max-content"}
					fontWeight={"medium"}
					color={"blue.400"}
					cursor={"pointer"}
					_hover={{ color: "white" }}
					onClick={onFollowUser}
					isLoading={isUpdating}
				>
					{isFollowing ? "Unfollow" : "Follow"}
				</Button>
			)}
      </Flex>
    </Flex>
    </GridItem> 
  );
};

export default FollowersUser;

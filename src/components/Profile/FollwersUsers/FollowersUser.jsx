import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
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
  return (<Flex gap={5} alignItems={"center"} justifyContent={"center"} w={"full"} alignSelf={"center"}>
      <Flex alignItems={"center"} gap={2} width={80}>
        <Link to={`/${user.username}`}>
          <Avatar src={user.profilePicURL} size={"md"} />
        </Link>
        <VStack spacing={2} alignItems={"flex-start"}>
          <Link to={`/${user.username}`}>
            <Box fontSize={12} fontWeight={"bold"}>
              {user.fullName}
            </Box>
          </Link>
          <Box fontSize={11} color={"gray.500"}>
            {user.followers.length} followers
          </Box>
        </VStack>
      </Flex>
      <Flex direction={"row"} gap={5} mr={10} width={50}> 
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
  );
};

export default FollowersUser;

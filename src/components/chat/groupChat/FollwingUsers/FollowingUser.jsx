import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowUser from "../../../../hooks/useFollowUser";
import useAuthStore from "../../../../store/authStore";
import { Link } from "react-router-dom";

const FollowingUser = ({ user, setUser }) => {
	const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);
	const authUser = useAuthStore((state) => state.user);

	const onFollowUser = async () => {
		await handleFollowUser();
	};
	return (
		<Flex gap={5} alignItems={"center"} alignSelf={"center"} w={"65%"} >
			<Flex alignItems={"center"} gap={2} width={80}>
				<Link to={`/${user.username}`}>
					<Avatar src={user.profilePicURL} size={"md"} />
				</Link>
				<VStack spacing={2} alignItems={"flex-start"} maxW={130} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
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
			<Flex direction={"row"} gap={5} alignContent={"left"}> 
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

export default FollowingUser;

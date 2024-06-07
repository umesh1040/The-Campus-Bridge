import { Avatar,Text, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useMembers from "../../../hooks/useMembers";
import useAuthStore from "../../../store/authStore";
import { Link } from "react-router-dom";


const MemberUser = ({ user, setUser }) => {
	const { isMember, isUpdating, handleMembers,data } = useMembers(user.uid);
	
	const authUser = useAuthStore((state) => state.user);
	const onMemberUser = async () => {
		await handleMembers();
	  };
	return (
	<Flex gap={5} alignItems={"center"} justifyContent={"center"} w={"full"} alignSelf={"center"}>
			<Flex alignItems={"center"} gap={2} width={80}>
					<Avatar src={user.profilePicURL} size={"md"} />
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
			{data.user.createdBy== user.uid  &&<Text>Admin</Text>}
			{authUser.uid == data.user.createdBy && authUser.uid != user.uid &&(
				<Button
					fontSize={13}
					bg={"transparent"}
					p={0}
					h={"max-content"}
					fontWeight={"medium"}
					color={"blue.400"}
					cursor={"pointer"}
					_hover={{ color: "white" }}
					onClick={onMemberUser}
					isLoading={isUpdating}
				>
					{isMember ? "Remove" : ""} 
				</Button>
			)}
			</Flex>
		</Flex>
	);
};

export default MemberUser;

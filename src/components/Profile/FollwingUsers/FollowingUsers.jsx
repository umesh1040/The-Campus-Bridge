import {  VStack } from "@chakra-ui/react";
import FollowingUser from "./FollowingUser";
import useGetFollowersUsers from "../../../hooks/useGetFollowing"


const FollowingUsers = () => {

	const { isLoading, followersUsers } = useGetFollowersUsers("Following");

	if (isLoading) return null;

	return (
		<VStack py={8} px={6} gap={4} al={"center"}>
			{followersUsers?.map((user) => (
				<FollowingUser user={user} key={user.id} />
			))}

		</VStack>
	);
};

export default FollowingUsers;

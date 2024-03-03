import {VStack } from "@chakra-ui/react";
import FollowersUser from "./FollowersUser"; 
import useGetFollowersUsers from "../../../hooks/useGetFollowers"


const FollowersUsers = () => {
	const { isLoading, followersUsers } = useGetFollowersUsers("Followers");
	
	if (isLoading) return null;
	return (
		<VStack py={8} px={6} gap={4}>
			{followersUsers?.map((user) => (
				<FollowersUser user={user} key={user.id}  />
			))}


		</VStack>
	);
};

export default FollowersUsers;
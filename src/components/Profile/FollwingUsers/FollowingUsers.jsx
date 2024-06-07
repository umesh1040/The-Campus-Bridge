import {  Grid } from "@chakra-ui/react";
import FollowingUser from "./FollowingUser";
import useGetFollowersUsers from "../../../hooks/useGetFollowing"


const FollowingUsers = () => {

	const { isLoading, followersUsers } = useGetFollowersUsers("Following");

	if (isLoading) return null;

	return ( 
		<Grid
			cursor={"pointer"}
			borderRadius={4}
			overflow={"scroll"}
			position={"relative"}
			aspectRatio={1 / 1}
			mt={2}
			m={0.5} 
			height={"90vh"}
			width={"100%"}
			templateColumns={{ md: "repeat(3, 1fr)",}}
			rowGap={5}
		>
			{!isLoading && (
				<>
				{followersUsers.map((user) => (
				<FollowingUser user={user} key={user.id}  />
					))}
				</>
			)}
		</Grid> 
);
};

export default FollowingUsers;

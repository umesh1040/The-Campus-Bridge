import {VStack ,Grid, Box} from "@chakra-ui/react";
import FollowersUser from "./FollowersUser"; 
import useGetFollowersUsers from "../../../hooks/useGetFollowers"


const FollowersUsers = () => {
	const { isLoading, followersUsers } = useGetFollowersUsers("Followers");
	
	if (isLoading) return null;
	return ( 
			<Grid
				cursor={"pointer"}
				borderRadius={4}
				overflow={"scroll"}
				position={"relative"}
				aspectRatio={1 / 1}
				m={0.5} 
				height={"90vh"}
				width={"100%"}
				templateColumns={{ 
						md: "repeat(3, 1fr)",
					}}
			>
				{!isLoading && (
					<>
					{followersUsers.map((user) => (
					<FollowersUser user={user} key={user.id}  />
						))}
					</>
				)}
			</Grid> 
	);
};

export default FollowersUsers;
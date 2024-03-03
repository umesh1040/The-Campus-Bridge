import { Box, Container, Flex } from "@chakra-ui/react";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";

const HomePage = () => {
	const [authUser] = useAuthState(auth);
	const navigate = useNavigate();
	if(!authUser){
		
		navigate("/auth");
		return null;
	}
	return (
		
		<Container maxW={"container.lg"}
		justifyContent="center" 
				alignItems="center" 
		>
			<Flex gap={20} >
				<Box flex={2} py={10}>
					<FeedPosts />
				</Box>
				<Box flex={3} mr={20} mt={20} display={{ base: "none", lg: "flex" }} maxW={"10%"}>
					<SuggestedUsers />
				</Box>
			</Flex>
		<Box justifyContent="center" 
				alignItems="center"  flex={3} mt={-20}display={{ base: "flex", lg: "none" }} maxW={"100%"}>
			<SuggestedUsers />
		</Box>
		</Container>
	);
};

export default HomePage;

import { Box, Center, Container, Flex,Text } from "@chakra-ui/react";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import Query from "../../components/Query/Query";

const QueryPage = () => {
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
        verticalAlign="center"
		>
			<Flex gap={20} 
            justifyContent="center" 
            alignItems="center" 
            mt={150}
			width={{ base: "100%", md: "650px", lg: "900px" }}
            verticalAlign="center">
            <Query/>
			</Flex>

		</Container>
	);
};

export default QueryPage;

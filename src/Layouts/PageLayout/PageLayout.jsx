import { Box, Flex, Spinner,Divider } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

const PageLayout = ({ children }) => {
	const { pathname } = useLocation();
	const [user, loading] = useAuthState(auth);
	const canRenderSidebar = pathname !== "/auth" && user;

	const checkingUserIsAuth = !user && loading;
	if (checkingUserIsAuth) return <PageLayoutSpinner />;

	return (
		<Flex
		flexDir={"column"}
		alignItems="center" 
		justifyContent="center" 
		height="80%" 
	  >
			{canRenderSidebar ? (
				<Box  w={{ base: "70px",  md: "241px", justifyContent:"center"}}>
					<Sidebar />
				</Box>
			) : null}
	
			<Divider my={2} border={"1.5px solid #7A828E"}  mt={-7} />
			<Box flex={1} w={{ base: "calc(100% - 10px)", md: "calc(100% - 240px)",justifyContent:"center"  }} mx={"auto"} mt={-90} >
				{children}
			</Box>
		</Flex>
	);
};

export default PageLayout;

const PageLayoutSpinner = () => {
	return (
		<Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
			<Spinner size='xl' />
		</Flex>
	);
};

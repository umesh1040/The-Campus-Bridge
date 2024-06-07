import { Box, Flex, Spinner, Divider } from "@chakra-ui/react";
import Navbar from "../../components/Sidebar/Sidebar";
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
      flexDir="column"
      alignItems="center"
      width="100%"
      justifyContent="center"
      height="60%"
      alignSelf="center"
      position="relative" 
	  
    >
      {canRenderSidebar ? (
     <Box  
      justifyContent="center"
      position="fixed"  
      top={0}  
      pt={1}
      background={"#0A0C10"} 
      width={"100%"}
      height={55} 
      zIndex={10}
      borderBottom={"1px solid gray"} 
    >
	    <Navbar />
    </Box>  
    ) : null}

      <Box
        flex={1}
        mt={-5}
        w={{ base: "calc(100% - 10px)", md: "900px" }}
        justifyContent="center"  alignItems="center"  
      >
        
      <Divider  /> 
      {children} 
      </Box>
    </Flex>
  );
};

export default PageLayout;

const PageLayoutSpinner = () => {
  return (
    <Flex flexDir="column" h="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );
};
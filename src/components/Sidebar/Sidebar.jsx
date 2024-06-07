import { Link as RouterLink } from "react-router-dom";
import { TheCampusBridgeLogo, TheCampusBridgeMobileLogo } from "../../assets/constants";
import SidebarItems from "./SidebarItems";
import { Box, Button, Divider, Flex, Link, Tooltip } from "@chakra-ui/react";
import {auth} from "../../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
const Sidebar = () => {

  const [authUser] = useAuthState(auth);
  if (!authUser) {
    navigate("/auth");
    return null;
  }

  return (
    <Box flexDir={"row"} width={"100%"}  >
      <Flex direction={"row"} gap={1} w='100%' height={"5%"}  justifyContent={"center"}>
        <Link to={"/"} as={RouterLink} pl={2}   display={{ base: "none", md: "none", lg: "flex" }} cursor='pointer'>
          <TheCampusBridgeLogo />
        </Link>
        <Flex direction={"row"} gap={1} cursor={"pointer"} align={"center"}  justifyContent="center">
          <Divider my={2} mx={{base: "0%", md: "0%", lg: "5px"}}/>
          <SidebarItems />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Sidebar;

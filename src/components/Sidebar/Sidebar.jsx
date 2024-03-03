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
    <Box
      height={"auto"}
      py={8}
      position={"sticky"}
      top={0}
      left={0}
      px={{ base: 2, md: 4 }}
    >
      <Flex direction={"row"} gap={1} w='full' height={"5%"} mt={-5}>
        <Link to={"/"} as={RouterLink} pl={2} display={{ base: "none", md: "none", lg: "block" }} cursor='pointer'>
          <TheCampusBridgeLogo />
        </Link>
        

        <Flex direction={"row"} gap={1} cursor={"pointer"} align={"center"}>
          <Divider my={2} mx={{base: "0%", md: "0%", lg: "5px"}}/>

          <SidebarItems />
        </Flex>

      </Flex>
    </Box>
  );
};

export default Sidebar;

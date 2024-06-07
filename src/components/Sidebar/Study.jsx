import { Box,Link, Tooltip } from "@chakra-ui/react"; 
import { HiOutlineAcademicCap } from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const Study = () => {
	
	const [authUser] = useAuthState(auth);
	const isSelected=location.pathname.startsWith("/study");
	if (!authUser) {
		navigate("/auth");
		return null;
	  }
	
  return (
    <Tooltip
      hasArrow
      label={"Study"}
      placement='right'
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
	  bg={isSelected  ? "whiteAlpha.400" : "transparent"}
    >
 			<Link
				display={"flex"}
				to={`study`}
				as={RouterLink}
				alignItems={"center"}
				gap={1}
				_hover={{ bg: "#272B33" }}
				bg={isSelected  ? "gray.800"  : "transparent"}
				border={"1px solid transparent"}
				borderColor={isSelected ? "green.300" : ""}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}>
					<HiOutlineAcademicCap size={25} />
					<Box display={{ base: "none", md: "block" }}>Study</Box>
			</Link>
    </Tooltip>
  );
};

export default Study;

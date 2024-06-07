import { Box, Link, Tooltip } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
 const isSelected =location.pathname === "/";
	return (
		<Tooltip
			hasArrow
			label={"Home"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
			bg={isSelected  ? "whiteAlpha.400" : "transparent"}
		>
			<Link
				display={"flex"}
				to={"/"}
				as={RouterLink}
				alignItems={"center"}
				gap={1}
				_hover={{ bg: "#272B33" }}
				bg={isSelected  ? "gray.800"  : "transparent"}
				borderRadius={6}
				border={"1px solid transparent"}
				borderColor={isSelected ? "green.300" : ""}   
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<AiFillHome  size={25}  />
				<Box display={{ base: "none", md: "block" }}>Home</Box>
			</Link>
		</Tooltip>
	);
};

export default Home;

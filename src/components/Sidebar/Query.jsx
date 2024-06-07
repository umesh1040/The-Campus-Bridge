import { Box, Flex, Tooltip,Link,Button } from "@chakra-ui/react"; 
import { AiFillQuestionCircle } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
const Queries = () => {
	
	const isSelected=location.pathname.startsWith("/query");
	return (
		<Tooltip
			hasArrow
			label={"Query"}
			placement='right'
			ml={1}
			openDelay={500}
			bg={isSelected  ? "whiteAlpha.400" : "transparent"}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={`query`}
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

					<AiFillQuestionCircle size={25}  />
					<Box  mb={1}  display={{ base: "none", md: "block" }}>Query</Box>
			</Link>
		
		</Tooltip>
	);
};

export default Queries;

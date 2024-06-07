import { Box, Link, Tooltip } from "@chakra-ui/react"; 
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore"
import { BsChatLeftTextFill } from "react-icons/bs";
const Chat = () => {
	const isSelected =location.pathname.startsWith("/chat");
	const authUser = useAuthStore((state) => state.user);
	
	return (
		<Tooltip
			hasArrow
			label={"Query"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
			bg={isSelected  ? "whiteAlpha.400" : "transparent"}
		>
			<Link
				display={"flex"}
				to={`chat/${authUser?.username}`}
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
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<BsChatLeftTextFill size={25} />
				<Box mb={1}  alignItems={"center"} display={{ base: "none", md: "block" }}>Chat</Box>
			</Link>
		</Tooltip>
	);
};

export default Chat;

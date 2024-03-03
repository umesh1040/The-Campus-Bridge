import { Box, Link, Tooltip } from "@chakra-ui/react";
import { MessageLogo } from "../../assets/constants";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore"
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
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<MessageLogo />
				<Box display={{ base: "none", md: "block" }}>Chat</Box>
			</Link>
		</Tooltip>
	);
};

export default Chat;

import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { MessageLogo } from "../../assets/constants";

const Chat = () => {
	return (
		<Tooltip
			hasArrow
			label={"Query"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Flex
				alignItems={"center"}
				gap={1}
				_hover={{ bg: "whiteAlpha.400" }}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<MessageLogo />
				<Box display={{ base: "none", md: "block" }}>Chat</Box>
			</Flex>
		</Tooltip>
	);
};

export default Chat;

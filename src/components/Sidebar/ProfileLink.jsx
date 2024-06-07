import { Avatar, Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
const ProfileLink = () => {
	const authUser = useAuthStore((state) => state.user);
	
	const isSelected=location.pathname.length > 8 && !location.pathname.startsWith("/chat") && !location.pathname.startsWith("/query") && !location.pathname.startsWith("/study");

	return (
		<Tooltip
			hasArrow
			label={"Profile"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={`/${authUser?.username}`}
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
				<Avatar size={"sm"} src={authUser?.profilePicURL || ""} />
				<Box display={{ base: "none", md: "block" }}>Profile</Box>
			</Link>
		</Tooltip>
	);
};

export default ProfileLink;

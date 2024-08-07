import {
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { RiUserSearchFill } from "react-icons/ri";
import useSearchUser from "../../hooks/useSearchUser";
import { useRef } from "react";
import SuggestedUsers from "../SuggestedUsers/SuggestedUsers";

const Search = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const searchRef = useRef(null);
	const { user, isLoading, getUserProfile, setUser } = useSearchUser();

	const handleSearchUser = (e) => {
		e.preventDefault();
		if(searchRef.current.value=="") return;
		getUserProfile(searchRef.current.value.trim());
	};

	return (
		<>
			<Tooltip
				hasArrow
				label={"Search"}
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
					onClick={onOpen}
				>
					<RiUserSearchFill size={25} />
					<Box display={{ base: "none", md: "flex" }}>Search</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
				<ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
				<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
					<ModalHeader>Search user</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSearchUser}>
							<FormControl>
								<FormLabel>Username</FormLabel>
								<Input placeholder='name' ref={searchRef} />
							</FormControl>

							<Flex w={"full"} justifyContent={"flex-end"}>
								<Button type='submit' ml={"auto"} size={"sm"} my={4} isLoading={isLoading}>
									Search
								</Button>
							</Flex>
						</form>
						<Container alignSelf={"center"} maxH={"300px"} overflowY={"scroll"}>
						{user && <SuggestedUsers user={user} />}
						</Container>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Search;

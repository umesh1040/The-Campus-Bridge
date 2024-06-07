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
	Select
} from "@chakra-ui/react"; 
import { useRef,useState } from "react"; 
import {
	collection,
	query,
	where,
	getDocs,
	setDoc,
	doc,
	updateDoc,
	serverTimestamp,
	getDoc,
	
	arrayUnion,
	  
  } from "firebase/firestore";
  import { firestore } from "../../firebase/firebase";

const AddSubject = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const SubjectNameRef = useRef(null); 

	const [branch, setBranch] = useState('');

	const handleSearchUser = async(e) => {
		e.preventDefault();
		if(SubjectNameRef.current.value=="") return;  
		const docRef = doc(firestore, "resources", branch);
		const docSnapshot = await getDoc(docRef);

		if (docSnapshot.exists()) {
		// Document exists, update it
		await updateDoc(docRef, {
			Subjects: arrayUnion({
			subjectName: SubjectNameRef.current.value, 
			resource: []
			})
		});
		} else {
		// Document doesn't exist, create it
		await setDoc(docRef, {
			Subjects: [{
			subjectName: SubjectNameRef.current.value,
			branch: branch,
			resource: []
			}]
		}, { merge: true }); // Merge option ensures that existing data is preserved
		}
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
					"Add Subject"
					<Box display={{ base: "none", md: "flex" }}>Search</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
				<ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
				<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
					<ModalHeader>Add Subject</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSearchUser}>
						<FormControl>
						<FormLabel>Branch</FormLabel>
							<Select
							placeholder="Select Branch"
							value={branch}
							onChange={(e) => setBranch(e.target.value)}
							>
							<option value="Computer Science and Technology">Computer Science and Technology</option>
							<option value="Chemical Engineering">Chemical Engineering</option>
							<option value="Civil Engineering">Civil Engineering</option>
							<option value="Electronics and Telecommunication Engineering">Electronics and Telecommunication Engineering</option>
							<option value="Food Technology">Food Technology</option>
							<option value="Mechanical Engineering">Mechanical Engineering</option>
							</Select>
						</FormControl>
												<FormControl>
								<FormLabel>Subject Name:</FormLabel>
								<Input placeholder='subject name' ref={SubjectNameRef} />
							</FormControl>
							<Flex w={"full"} justifyContent={"flex-end"}>
								<Button type='submit' ml={"auto"} size={"sm"} my={4} >
									Add
								</Button>
							</Flex>
						</form>
 
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddSubject;

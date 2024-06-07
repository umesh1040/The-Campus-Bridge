import {
	Box,
	Button,
	CloseButton,
	Flex,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	Tooltip,
	useDisclosure,
	Text
  } from "@chakra-ui/react";
  import { CreatePostLogo } from "../../assets/constants";
  import { PiPlusSquareBold } from "react-icons/pi";
  import { useRef, useState } from "react";
  import usePreviewImg from "../../hooks/usePreviewImg";
  import useShowToast from "../../hooks/useShowToast";
  import useAuthStore from "../../store/authStore";
  import usePostStore from "../../store/postStore";
  import useUserProfileStore from "../../store/userProfileStore";
  import { useLocation } from "react-router-dom";
  import { addDoc, arrayUnion, collection, doc, updateDoc,Timestamp } from "firebase/firestore";
  import { firestore, storage } from "../../firebase/firebase"; 
  import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
  import { FaPhotoVideo } from "react-icons/fa";


  const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [caption, setCaption] = useState("");
	const fileRef = useRef(null);
	const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
	const showToast = useShowToast();
	const { isLoading, handleCreatePost } = useCreatePost();
	const [file, setFile] = useState(null);
	const [filePreview, setFilePreview] = useState(null);
 
	const handlePostCreation = async () => {
	  try { 
		await handleCreatePost(file, caption);
		onClose();
		setCaption("");
		setSelectedFile(null);
		setFile(null);
		setFilePreview(null);
	  } catch (error) {
		showToast("Error", error.message, "error");
	  }
	};
    const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
		  if (
			selectedFile.type.startsWith("image/") ||
			selectedFile.type.startsWith("video/")  
		  ) {
			setFile(selectedFile);
			setFilePreview(URL.createObjectURL(selectedFile));
		  } else {
			console.error(
			  "Unsupported file type. Please select an image, video, or PDF file."
			);
		  }
		}
	  };
	return (
	  <>
		<Tooltip
		  hasArrow
		  label={"Create"}
		  placement="right"
		  ml={1}
		  openDelay={500}
		  display={{ base: "block", md: "none" }}
		>
		  <Flex
			alignItems="center"
			gap={1}
			_hover={{ bg: "whiteAlpha.400" }}
			borderRadius={6}
			p={2}
			w={{ base: 10, md: "full" }}
			justifyContent={{ base: "center", md: "flex-start" }}
			onClick={onOpen}
		  >
			<PiPlusSquareBold size={25} />
			<Box display={{ base: "none", md: "block" }}>Create</Box>
		  </Flex>
		</Tooltip>
  
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
		  <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
  
		  <ModalContent bg="black" border="1px solid gray">
			<ModalHeader>Create Post</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
			  <Textarea
				placeholder="Post caption..."
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
			  />
  			  {file && (
				<Flex mt={5} w="full" position="relative" justifyContent="center">
				  {file?.type.startsWith("image/") ? (
					<Box>
					<Image src={filePreview} alt="Selected img" /> 
					</Box>
				  ) : (
					<video src={filePreview} controls width="200" height="150" />
				  )}
				</Flex>
			  )}
			  <Input
				type="file"
				hidden
				ref={fileRef}
				onChange={(e) => handleFileChange(e)}
				accept="image/*, video/*"
			  />
  
			  <FaPhotoVideo 
				onClick={() => fileRef.current.click()}
				style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
				size={35}
			  />

			</ModalBody>
  
			<ModalFooter>
			  <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
				Post
			  </Button>
			</ModalFooter>
		  </ModalContent>
		</Modal>
	  </>
	);
  };
  
  export default CreatePost;
  function useCreatePost() {
	const showToast = useShowToast();
	const [isLoading, setIsLoading] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const createPost = usePostStore((state) => state.createPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const { pathname } = useLocation();
  
	const handleCreatePost = async (selectedFile, caption) => {
	  if (isLoading) return;
	  if (!selectedFile) throw new Error("Please select a file");
	  setIsLoading(true);
  
	  const newPost = {
		caption: caption,
		likes: [],
		comments: [],
		createdAt:  Timestamp.now(),
		createdBy: authUser.uid,
	  };
  
	  try { 
		const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
		const userDocRef = doc(firestore, "users", authUser.uid);
		const fileRef = ref(storage, `posts/${postDocRef.id}`);
   
		 
		const uploadTask = uploadBytesResumable(fileRef, selectedFile);
  
		uploadTask.on(
		  "state_changed",
		  (snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			// setUploadProgress(progress);
		  },
		  (error) => {
			console.error("Error uploading file:", error);
		  },
		  () => {
			getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
	  
				await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
				await updateDoc(postDocRef, {
				imageURL: downloadURL,
				type: selectedFile.type.startsWith("image/") ? "img" : "video",
				});

				newPost.imageURL = downloadURL;

				if (userProfile.uid === authUser.uid) createPost({ ...newPost, id: postDocRef.id });

				if (pathname !== "/" && userProfile.uid === authUser.uid) addPost({ ...newPost, id: postDocRef.id });

			});
		  }
		);

		showToast("Success", "Post created successfully", "success");
		 
	  } catch (error) {
		showToast("Error", error.message, "error");
	  } finally {
		setIsLoading(false);
	  }
	};
  
	return { isLoading, handleCreatePost };
  }
	
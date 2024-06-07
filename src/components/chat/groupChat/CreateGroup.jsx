import React, { useRef, useState } from "react";
import Img from "../../../assets/img/img.png";
import {
  Box,
  Input,
  Text,
  Image,
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  FormLabel,
  FormControl,
  Avatar
} from "@chakra-ui/react";
import FollowingUsers from "./FollwingUsers/FollowingUsers";
import FollowersUsers from "./FollwersUsers/FollowersUsers";
import usePreviewImg from "../../../hooks/usePreviewImg"
import { firestore, storage } from "../../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import useAuthStore from "../../../store/authStore";
import useShowToast from "../../../hooks/useShowToast";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, selectedFile, clearSelectedFile } = usePreviewImg();
  const imageRef = useRef(null);
  const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();

  const handleCreateGroup = async () => {
    try {
      const updatedSelectedUsers = [...selectedUsers, { uid: authUser.uid }];
       
      if(selectedFile==null ){
        showToast("Error", "Please select profile picture");
        return;
      }
      if(groupName=="" ){
        showToast("Error", "Please enter group name");
        return;
      }
      if(updatedSelectedUsers.length<2){
        showToast("Error", "Please select atleast one member");
        return;
      }
      const groupRef = doc(collection(firestore, "GroupChat"));
      const groupData = {
        groupInfo: {
          groupName: groupName,
          createdBy: authUser.uid,
          members: updatedSelectedUsers.map(user => user.uid),
          groupId: groupRef.id
        },
        date: serverTimestamp()
      };

      // If selectedFile is available, upload the image to Firebase Storage
      if (selectedFile) {
        // Create a reference to the storage location
        const storageRef = ref(storage, `groupImages/${groupRef.id}`);

        // Upload the image file
        await uploadString(storageRef, selectedFile, "data_url");

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Add the groupPicURL to the groupData
        groupData["groupInfo"].groupPicURL = downloadURL;
      }

      // Set the document data
      await setDoc(groupRef, groupData);

      await setDoc(doc(firestore, "Groupchats", groupRef.id), { messages: [] });
      setGroupName(""); // Reset groupName
      setSelectedUsers([]); // Reset selectedUsers
      showToast("Success:","Group Created successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };
  const clearAndonOpen =() =>{
    setGroupName(""); // Reset groupName
    setSelectedUsers([]); // Reset selectedUsers
    onOpen();
  }

  return (
    <Box display="flex" flexDirection="column" m={1}>
      <Flex borderBottom="1px solid gray" paddingBottom="5px" flexDirection={"row"} gap={1}>
        <Button onClick={clearAndonOpen}>+</Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            <ModalBody pb={6}>
              <Flex direction={"row"} alignItems={"center"} gap={5}>
                <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                <Avatar
                  src={selectedFile == null ? Img : selectedFile}
                  onClick={() => imageRef.current.click()}
                  borderRadius={"50px"}
                  style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
                  w="50px"
                  h="50px"
                />
                <FormControl mt={4}>
                  <Input
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </FormControl>
              </Flex>
              <Flex direction={"column"} height={"70vh"} overflowY={"scroll"} overflowX={"hidden"} gap={2} css={{ scrollbarWidth: 'none' }}>
                <Text>Your Followings</Text>
                <FollowingUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                <Text>Your Followers</Text>
                <FollowersUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
              </Flex>
              <Button mt={4} colorScheme="teal" onClick={handleCreateGroup}>
                Create Group
              </Button>
            </ModalBody>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateGroup;

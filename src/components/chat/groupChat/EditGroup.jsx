import React, { useState,useRef } from "react";
import Img from "../../../assets/img/img.png";
import {
  Box,
  Input,
  Text,
  Image,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  FormControl,
  Avatar
} from "@chakra-ui/react";
import usePreviewImg from "../../../hooks/usePreviewImg";
import { firestore, storage } from "../../../firebase/firebase";
import {  updateDoc, doc, getDoc } from "firebase/firestore";
import useAuthStore from "../../../store/authStore";
import useShowToast from "../../../hooks/useShowToast";
import { getDownloadURL,ref,uploadString } from "firebase/storage";

const EditGroup = ({ isOpen, onClose, groupId, groupName, groupPicURL }) => {
  const [newGroupName, setNewGroupName] = useState(groupName || "");
  const [previewImage, setPreviewImage] = useState(null); // State to hold the image preview URL
  const { handleImageChange, selectedFile, clearSelectedFile } = usePreviewImg();
  const imageRef = useRef(null);
  const showToast = useShowToast();

  // Function to handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file); // Set the selected file
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    } else {
      // Display an error message if the selected file is not an image
      showToast("Error", "Please select an image file");
    }
  };

  const handleEditGroup = async () => {
    try {
      if (!newGroupName.trim()) {
        showToast("Error", "Please enter a group name");
        return;
      }
      const groupRef = doc(firestore, "GroupChat", groupId);
      const docSnapshot = await getDoc(groupRef); // Retrieve the document snapshot
      const groupData = docSnapshot.data(); // Extract the document data
      
      // Check if the document exists and contains groupInfo
      if (docSnapshot.exists() && groupData.groupInfo) {
        const updates = { ...groupData }; // Copy existing data
      
        // Update group name if new group name is provided
        if (newGroupName) {
          updates.groupInfo.groupName = newGroupName;
        }
      
        // Upload and update groupPicURL if new file is selected
        if (selectedFile) {
          const storageRef = ref(storage, `groupImages/${groupId}`);
          await uploadString(storageRef, selectedFile, "data_url"); 
          const downloadURL = await getDownloadURL(storageRef);
          updates.groupInfo.groupPicURL = downloadURL;
        }
      
        // Update the document with the updated data
        await updateDoc(groupRef, updates);
      } else {
        console.error("Document not found or missing groupInfo");
      }
      
      onClose(); // Close the modal after editing
    } catch (error) {
      console.error("Error editing group:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody bg={"black"} pb={5}>
          <ModalBody pb={6}>
            <Flex direction={"column"} alignItems={"center"} gap={5}>
            <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                <Avatar
                  src={selectedFile == null ? groupPicURL : selectedFile}
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
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </FormControl>
            </Flex>
            <Button mt={4} colorScheme="teal" onClick={handleEditGroup}>
              Edit Group
            </Button>
          </ModalBody>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditGroup;

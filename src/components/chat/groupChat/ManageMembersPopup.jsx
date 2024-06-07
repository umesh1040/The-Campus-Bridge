import React, { useContext } from "react";
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

import Users from "./MemberUsers";
import Search from "./Search";

const ManageMembersPopup = ({ onClose }) => {
  return (
   <Box>
    <Modal isOpen={true} onClose={onClose} isCentered  > {/* Adjusted size to "md" */}
      <ModalOverlay />
      <ModalContent  width={{base:"90%",md:"500px"}}>
        <ModalHeader>Manage Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Users />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Box> 
  );
};

export default ManageMembersPopup;

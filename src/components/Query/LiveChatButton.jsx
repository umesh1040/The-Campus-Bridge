import { FaComments } from "react-icons/fa";
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import {
  Box,
  IconButton,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  Code,
  Stack,
  Spinner, // Import Spinner for loading animation
  HStack, Progress,
  useStyleConfig
} from "@chakra-ui/react";  
import AiwithText from './AiwithText';
import AiwithImage from './AiwithImage';

const LiveChatButton = () => {
  const [aiWith, setLAiWith] = useState('text');

  const handleAiWith = (value) => {
    setLAiWith(value);
  } 

  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const activeButtonStyle = useStyleConfig("Button", {
    variant: "solid",
    colorScheme: "blue",
  });

  return (
    <Box position="fixed" bottom={6} right={{ base: 6, md: 90 }} zIndex={10}>
      <IconButton
        aria-label="Live Chat"
        icon={<FaComments />}
        size="lg"
        onClick={onOpen}
        colorScheme="blue"
      />
      
      <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
        <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
        <ModalContent bg={"black"} border={"1px solid gray"} maxWidth="800px">
          <ModalHeader>Enter Query</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} alignItems={"center"}>
            <FormControl>
              <Box>
                <Box style={{ margin: '30px 0' }}>
                  <Button
                    onClick={() => handleAiWith('text')}
                    sx={aiWith === 'text' ? activeButtonStyle : {}}
                  >
                    AI with Text
                  </Button>

                  <Button
                    style={{ marginLeft: '20px' }}
                    onClick={() => handleAiWith('image')}
                    sx={aiWith === 'image' ? activeButtonStyle : {}}
                  >
                    AI with Image
                  </Button>
                </Box>

                {aiWith === 'text' ? <AiwithText /> : <AiwithImage />}
              </Box>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LiveChatButton;

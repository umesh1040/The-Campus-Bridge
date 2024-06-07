import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import {
  Box,
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
  HStack, Progress
} from "@chakra-ui/react"; 

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInput, setUserInput] = useState('');
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const submitUserInput = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/process_data', { userInput });
      setProcessedData(response.data);
    } catch (error) {
      setError('An error occurred while processing the data.');
    } finally {
      setLoading(false);
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
          <Box display={{ base: "none", md: "flex" }}>Search</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
        <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
        <ModalContent bg={"black"} border={"1px solid gray"}>
          <ModalHeader>Enter Query</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} alignItems={"center"}>
            <FormControl>
              <FormLabel>Query</FormLabel>
              <Textarea placeholder='query' onChange={handleUserInput} />
            </FormControl>

            <Flex w={"full"} justifyContent={"flex-end"}>
              <Button onClick={submitUserInput} ml={"auto"} size={"sm"} my={4}>
              "Submit"
              </Button>
            </Flex>
            {processedData?.length > 0 && (
              <Flex justifyContent={"center"} width={"100%"}>
                {processedData.map((item, index) => (
                  <Code colorScheme="whatsapp" key={index}>
                    <span style={{ whiteSpace: "pre-line" }}>{item.answer}</span>
                  </Code>
                ))}
              </Flex>
            )}
					{loading &&
                  <Flex spacing={3} gap={5} direction={"column"} overflow={"hidden"}>
                    <Progress size='lg' width="800px" isIndeterminate  />
                    <Progress size='lg' width="90%"  isIndeterminate  />
                    <Progress size='lg' width="80%"  isIndeterminate  />
                  </Flex>
          }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;

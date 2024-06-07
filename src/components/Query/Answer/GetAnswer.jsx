
import { Flex, VStack, Box, FormLabel, Button } from "@chakra-ui/react";
import React, { useState, useEffect,useRef } from "react";
import useCreateAnswer from "../../../hooks/useCreateAnswer";
import RetrieveAnswers from "./RetrieveAnswers";
import JoditEditor from 'jodit-react';

const GetAnswer = ({ query }) => {
  const [fileContent, setFileContent] = useState('');
  const { isLoading, setIsLoading, error, create } = useCreateAnswer();
  const editor = useRef(null);
  const [inputs, setInputs] = useState({
    content: "",
    queryId: "",
});

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await fetch(query.queryContent);
        if (response.ok) {
          const content = await response.text();
          setFileContent(content);
        } else {
          console.error('Failed to fetch file content:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
 };    fetchFileContent();
}, [query.queryContent]);

const handleCreate = async () => {
  setIsLoading(true);
  try {
    const inputs = { content: editor.current.value, queryId: query.queryId };
    await create(inputs);
    window.location.reload();
  } catch (error) { 
  } finally {
    setIsLoading(false);
  }
};

const config = {
  readonly: false,
  placeholder: 'Start typing...',
  uploader: {
    insertImageAsBase64URI: true,
    imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
    withCredentials: false,
    format: 'json',
    method: 'POST',
    url: '*',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    prepareData: function (data) {
      data.append('file', this.file);
      return data;
    },
    isSuccess: function (resp) {
      return !resp.error;
    },
    getMsg: function (resp) {
      return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
    },
    process: function (resp) {
      return {
        files: [resp.data],
        path: '',
        baseurl: '',
        error: resp.error ? 1 : 0,
        msg: resp.msg,
      };
    },
    defaultHandlerSuccess: function (data, resp) {
      const files = data.files || [];
      if (files.length) {
        const imageUrl = files[0];

        const imageHtml = `<img src="${imageUrl}" alt="Uploaded Image" />`;
        this.selection.insert(imageHtml);
      }
    },
    defaultHandlerError: function (resp) {
      this.events.fire('errorPopap', this.i18n(resp.msg));
    },
  },
  resize: "vertical",
  toolbarAdaptive: false, 
  buttons: ['source', '|', 'bold', 'italic', 'underline', '|', 'ul', 'ol', '|', '|', '|', 'undo', 'redo', '|', 'align', 'table', 'link', 'image'],
  events: {
    onTouchMove: (e) => e.preventDefault(),
  },
};


  return (
    <Flex
    w="100%"
    mt={-95}
    borderBottom="1px solid #ddd"
    flexDirection={"column"}
    width={{ base: "100%", md: "650px", lg: "900px" }}
    minW={10}
    marginX="auto"
  >
    <Box
      border="1px solid #7A828E"
      borderRadius="8px"
      padding="0.5em"
      boxShadow="0 2px 8px #7A828E"
      marginBottom="1em"
      width="100%"
    >
      <VStack spacing={1} alignItems="flex-start" width="100%">
        <Flex align="center">
          <Box fontSize="20" marginLeft="2" textAlign="justify">
            {query.queryTitle}
          </Box>
        </Flex>

        <Flex align="center">
          <Box fontSize="sm" marginLeft="2">
            {query.queryKeywords}
          </Box>
        </Flex>
      </VStack>

      <Box fontSize="lg" mt={5} ml={5}>
        <div dangerouslySetInnerHTML={{ __html: fileContent }} />
      </Box>
    </Box>
    
    <Box
      border="1px solid #7A828E"
      borderRadius="8px"
      padding="0.5em"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      width="100%"
      mt={5}
    >

      <RetrieveAnswers  type={"answer"} Id={query.queryId}/>

    </Box>
    <Box
      border="1px solid #7A828E"
      borderRadius="8px"
      padding="0.5em"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      width="100%"
      mt={5}
    >


      <FormLabel>Your Answer</FormLabel>
      <JoditEditor 
                ref={editor}
                config={config}
                tabIndex={1}
                value={inputs.content}
      />

      <Button onClick={handleCreate} colorScheme="teal" mt={4} isLoading={isLoading}>
          Submit Answer
        </Button>
      </Box>
    </Flex>
  );
};

export default GetAnswer;



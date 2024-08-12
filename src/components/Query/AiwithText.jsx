import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GEMINI_API_KEY } from '../core/config'; 
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import useShowToast from "../../hooks/useShowToast";

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
    HStack, Progress
  } from "@chakra-ui/react"; 
const AiwithText = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyD9cLdw_AcP8EggEkkoGLEXJCi4dIvOgUA"); 
 
	const showToast = useShowToast();
    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Generative AI Call to fetch text insights
     */
    async function aiRun() {
        setResponse('');
        if (search=="") {
			showToast("Error", 'Please Enter query before searching.', "error");
            return;
        }
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const prompt = ` ${search}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
    }

    return (
        <Box>
            <Box style={{ display: 'flex' }} flexDirection={"column"} > 
              <FormLabel>Query</FormLabel>
              <Textarea placeholder='query'  onChange={(e) => handleChangeSearch(e)} />
                <Button  m={5} ml={0} width={"80px"} onClick={() => handleClick()}>Search</Button>
            </Box>

            {
                loading == true && (aiResponse == '') ?
                <Flex spacing={3} gap={5} direction={"column"} overflow={"hidden"}>
                    <Progress size='lg' width="800px" isIndeterminate  />
                    <Progress size='lg' width="90%"  isIndeterminate  />
                    <Progress size='lg' width="80%"  isIndeterminate  />
                </Flex>
                    :
                    <Box style={{ margin: '30px 0' }}> 
                     <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown> 
                    </Box>
            }
        </Box>
    );
};

export default AiwithText;

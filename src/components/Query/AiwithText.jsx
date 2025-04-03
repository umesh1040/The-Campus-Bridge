import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRoot } from 'react-dom/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

import useShowToast from "../../hooks/useShowToast";

import {
    Box,
    Button,
    Flex,
    FormLabel,
    Textarea,
    Progress,
    Spinner
} from "@chakra-ui/react";

const AiwithText = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyAoOrZcy6MtugZDAt6f3mzJLBVDkUQWE1E");
    const showToast = useShowToast();
    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Exponential Backoff with Retry Logic
     */
    const fetchWithRetry = async (model, prompt, retries = 3, delay = 1000) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = await response.text();
                return text;
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
                if (attempt < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
                } else {
                    throw error;
                }
            }
        }
    };

    /**
     * Generative AI Call to fetch text insights
     */
    async function aiRun() {
        setResponse('');
        if (search.trim() === "") {
            showToast("Error", 'Please enter a query before searching.', "error");
            return;
        }

        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const prompt = `${search}`;

        try {
            const text = await fetchWithRetry(model, prompt);
            setResponse(text);
        } catch (error) {
            showToast("Error", 'Failed to fetch response from AI. Please try again later.', "error");
            console.error("API Request Error:", error);
        }

        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleClick = () => {
        aiRun();
    };

    return (
        <Box>
            <Box style={{ display: 'flex' }} flexDirection={"column"}> 
                <FormLabel>Query</FormLabel>
                <Textarea placeholder='Enter your query here' onChange={handleChangeSearch} value={search} />
                <Button m={5} ml={0} width={"80px"} onClick={handleClick}>Search</Button>
            </Box>

            {loading ? (
                <Flex direction="column" gap={3} alignItems="center" justifyContent="center" mt={5}>
                    <Spinner size="xl" speed="0.65s" color="blue.500" />
                    <Progress size='lg' width="80%" isIndeterminate />
                </Flex>
            ) : (
                <Box style={{ margin: '30px 0' }}>
                    {aiResponse ? (
                        <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
                    ) : (
                        <Box color="gray.500">No response yet. Try entering a query.</Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default AiwithText;

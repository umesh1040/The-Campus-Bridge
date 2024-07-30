import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from './imageHelper';
import useShowToast from "../../hooks/useShowToast";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    Code,
    Flex,
    Progress
} from "@chakra-ui/react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AiwithImage = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyD9cLdw_AcP8EggEkkoGLEXJCi4dIvOgUA");
	const showToast = useShowToast();

    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');

    async function aiImageRun() {
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            question, imageInlineData
        ]);
        const response = await result.response;
        const text = await response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleClick = () => {
        if (!image) {
			showToast("Error", 'Please select an image before searching.',"error");
            return;
        }
        aiImageRun();
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Getting base64 from file to render in DOM
        getBase64(file)
            .then((result) => {
                setImage(result);
            })
            .catch(e => console.log(e));

        // Generating content model for Gemini Google AI
        fileToGenerativePart(file).then((image) => {
            setImageInlineData(image);
        });
    }

    // Converts a File object to a GoogleGenerativeAI.Part object.
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    return (
        <Box>
            <Box style={{ display: 'flex' }}>
                <input type='file' accept="image/*" onChange={(e) => handleImageChange(e)} />
            </Box>
            {image && <img src={image} alt="Selected" style={{ width: '30%', marginTop: 30 }} />}
            
            <Box style={{ marginTop: '20px' }}>
                <FormControl>
                    <FormLabel>Enter your question related to the photo (optional):</FormLabel>
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What's in this photo?"
                    />
                </FormControl>
            </Box>
                <Button m={5} ml={0} onClick={() => handleClick()}>Search</Button>

            {loading && !aiResponse ? (
                <Flex spacing={3} gap={5} direction={"column"} overflow={"hidden"}>
                    <Progress size='lg' width="800px" isIndeterminate  />
                    <Progress size='lg' width="90%"  isIndeterminate  />
                    <Progress size='lg' width="80%"  isIndeterminate  />
                </Flex>
            ) : (
                <Box style={{ margin: '30px 0' }}>
                    <Box style={{ margin: '30px 0' }}> 
                     <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown> 
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AiwithImage;

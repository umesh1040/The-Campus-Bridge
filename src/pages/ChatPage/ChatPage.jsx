import { Box, Container, Flex ,Text} from "@chakra-ui/react";

import React, {useState, useEffect } from "react";

import useAuthStore from "../../store/authStore";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";



const ChatPage = () => {
	    const user = useAuthStore((state) => state.user);
		const navigate = useNavigate();
        const [authUser] = useAuthState(auth);
        if(!authUser){
            navigate("/auth");
            return null;
        }
    return (
		<Container mt={90} mb={100}  maxW="100%">
            <Text>Chat Page</Text>
        </Container>
    );
}

export default ChatPage;

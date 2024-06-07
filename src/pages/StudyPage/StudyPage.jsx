
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import Study from "../../components/Study/StudyRetrive";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
 
const StudyPage = () => { 
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  if(!authUser){
		navigate("/auth");
		return null;
	}
  return (
    <Box p={1} mt={85} padding={5} width={{ base: "100%", md: "400px", lg: "860px" }} alignItems={"center"} alignContent={"center"}>
        <Study/>
    </Box>
  );
};

export default StudyPage;

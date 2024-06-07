import React from "react";
import { Container, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import Query from "../../components/Query/Query";
import LiveChatButton from "../../components/Query/LiveChatButton";

const QueryPage = () => {
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();

  if (!authUser) {
    navigate("/auth");
    return null;
  }

  return (
    <Container maxW={"container.lg"} justifyContent="center" alignItems="center" mt={85}>
        <Query /> 
        <Box mr={150}>
      <LiveChatButton  />  
      </Box>
    </Container>
  );
};

export default QueryPage;

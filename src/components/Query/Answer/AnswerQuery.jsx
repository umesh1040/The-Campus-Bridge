import { Box, Center, Container, Flex, Button } from "@chakra-ui/react";
import { auth } from "../../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import GetAnswers from "./GetAnswers";

const AnswerQuery = () => {
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();

  const { queryId } = useParams();
  if (!authUser) {
    
    navigate("/auth");
    return null;
  }

  return (
    <Container
      maxW={"container.lg"}
      justifyContent="center"
      alignItems="center"
      verticalAlign="center"
      height="100vh"
    >
      <Flex
        gap={0}
        justifyContent="center"
        alignItems="center"
        mt={150}
        verticalAlign="center"
        direction="column" 
      >
        <GetAnswers type={"Query"} Id={queryId} />
      </Flex>
    </Container>
  );
};

export default AnswerQuery;

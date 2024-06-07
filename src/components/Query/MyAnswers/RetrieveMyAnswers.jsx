
import { Box, Text } from '@chakra-ui/react';

import GetAnswers from "./GetAnswers";
import { auth } from "../../../firebase/firebase";

import { useAuthState } from "react-firebase-hooks/auth";

const RetrieveMyAnswer = ({ queryId =1}) => {

  const [authUser] = useAuthState(auth);
  
  return (
    <Box ml={-5} mr={-5}>
      <GetAnswers type={"myAnswer"} Id={authUser.uid}/>
    </Box>
  );
};

export default RetrieveMyAnswer;

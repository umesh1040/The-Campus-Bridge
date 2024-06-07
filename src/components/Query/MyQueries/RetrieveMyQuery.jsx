
import { Box } from '@chakra-ui/react';
import GetQueries from "../GetQueries";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/firebase";

const RetrieveMyQuery = ({ queryId =1}) => {

  const [authUser] = useAuthState(auth);

  return (
    <Box ml={-5} mr={-5}>
      <GetQueries type={"myQuery"} Id={authUser.uid}/>
    </Box>
  );
};

export default RetrieveMyQuery;

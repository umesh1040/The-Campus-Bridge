
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import Study from "../../components/Study/StudyRetrive";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';


const FeedTab1 = () => <div><Study path={"resources"}/></div>;
const FeedTab2 = () => <div><Study path={"roadmap"}/></div>;

const StudyPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  if(!authUser){
		navigate("/auth");
		return null;
	}
  return (
    <Box p={1} mt={85}  width={{ base: "100%", md: "400px", lg: "860px" }} alignItems={"center"} alignContent={"center"}>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab onClick={() => setSelectedTab(0)}>Resources</Tab>
          <Tab onClick={() => setSelectedTab(1)}>Roadmaps</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{selectedTab === 0 && <FeedTab1 />}</TabPanel>
          <TabPanel>{selectedTab === 1 && <FeedTab2 />}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default StudyPage;

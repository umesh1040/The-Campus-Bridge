
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs,Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import FollowersUsers from "../../components/Profile/FollwersUsers/FollowersUsers";
import FollowingUsers from "../../components/Profile/FollwingUsers/FollowingUsers";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";

const FeedTab1 = () => <div><FollowersUsers /></div>;
const FeedTab2 = () => <div><FollowingUsers /></div>;

const UserProfileWithTabs = () => {
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  const { username } = useParams();
  const { userProfile } = useGetUserProfileByUsername(username);

  if (!authUser) {
    navigate("/auth");
    return null;
  }

  const tab = new URLSearchParams(window.location.search).get("tab");
  const defaultTab = tab === "followers" ? 0 : 1;

  const [selectedTab, setSelectedTab] = useState(defaultTab); 


  return (
    <Box p={1} mt={95}
    width={{ base: "350px", md: "650px", lg: "900px" }}>
      <Text>{userProfile?.username}</Text>
      <Tabs isFitted variant="enclosed"  defaultIndex={selectedTab}>
        <TabList>
          <Tab onClick={() => setSelectedTab(0)}>Followers</Tab>
          <Tab onClick={() => setSelectedTab(1)}>Following</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{selectedTab === 0 && <FeedTab1 />}</TabPanel>
          <TabPanel>{selectedTab === 1 && <FeedTab2 />}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserProfileWithTabs;

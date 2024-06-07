import React from "react";
import { VStack, Checkbox } from "@chakra-ui/react";
import FollowersUser from "./FollowersUser"; 
import useGetFollowersUsers from "../../../../hooks/useGetFollowers";

const FollowersUsers = ({ selectedUsers, setSelectedUsers }) => {
  const { isLoading, followersUsers } = useGetFollowersUsers("Followers");
  
  if (isLoading) return null;
  
  const handleCheckboxChange = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  return (
    <VStack gap={5}  alignItems={"right"}>
      {followersUsers?.map((user) => (
        <Checkbox
          key={user.id}
          isChecked={selectedUsers.includes(user)}
          onChange={() => handleCheckboxChange(user)}
        >
          <FollowersUser user={user} />
        </Checkbox>
      ))}
    </VStack>
  );
};

export default FollowersUsers;

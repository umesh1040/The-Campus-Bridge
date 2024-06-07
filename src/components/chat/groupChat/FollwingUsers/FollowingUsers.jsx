import React from "react";
import { VStack, Checkbox } from "@chakra-ui/react";
import FollowingUser from "./FollowingUser";
import useGetFollowersUsers from "../../../../hooks/useGetFollowing";

const FollowingUsers = ({ selectedUsers, setSelectedUsers }) => {
  const { isLoading, followersUsers } = useGetFollowersUsers("Following");

  if (isLoading) return null;

  const handleCheckboxChange = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <VStack gap={5} alignItems={"right"}>
      {followersUsers?.map((user) => (
        <Checkbox
          key={user.id}
          isChecked={selectedUsers.includes(user)}
          onChange={() => handleCheckboxChange(user)}
        >
          <FollowingUser user={user} />
        </Checkbox>
      ))}
    </VStack>
  );
};

export default FollowingUsers;

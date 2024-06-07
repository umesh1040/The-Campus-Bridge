import { useEffect, useState, useContext } from "react";
import useShowToast from "./useShowToast";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,getDoc
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import useGetUserProfileByUsername from "./useGetUserProfileByUsername";
import { ChatContext } from "../context/ChatContextGroup";

const useGetMembers = () => {
  const { username } = useParams();
  const { userProfile } = useGetUserProfileByUsername(username);
  const [isLoading, setIsLoading] = useState(true);
  const [membersUsers, setMembersUsers] = useState([]);
  const showToast = useShowToast();
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const getMembersUsers = async () => {
      if (!data || !data.chatId || !userProfile) return;
      try {
        setIsLoading(true);
        
        const groupChatDocRef = doc(firestore, "GroupChat", data.chatId);
        const groupChatSnap = await getDoc(groupChatDocRef);
        const membersData = groupChatSnap.data()?.groupInfo?.members || [];

        const usersRef = collection(firestore, "users");
        const q = query(
          usersRef,
          where("uid", "in", [userProfile?.uid, ...membersData]),
          orderBy("uid")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          setMembersUsers(users);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching members:", error);
        showToast("Error fetching members");
      } finally {
        setIsLoading(false);
      }
    };

    getMembersUsers();
  }, [showToast, userProfile, data?.chatId]);

  return { isLoading, membersUsers, userProfile };
};

export default useGetMembers;

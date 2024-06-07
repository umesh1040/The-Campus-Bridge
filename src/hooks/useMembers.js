import { useEffect, useState, useContext } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, doc, updateDoc,collection,getDoc,onSnapshot } from "firebase/firestore"; // Import only necessary functions

import { ChatContext } from "../context/ChatContextGroup";

const useMembers = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { data } = useContext(ChatContext);
  const showToast = useShowToast();
  useEffect(() => {
    const checkMembership = async () => {
      if (data && data.chatId) {
        try {
          const groupChatRef = collection(firestore, "GroupChat");
          const groupInfoRef = doc(groupChatRef, data.chatId);
          const groupInfoSnap = await getDoc(groupInfoRef);
          const existingMembers = groupInfoSnap.data()?.groupInfo?.members || [];
          const isMember = existingMembers.includes(userId);
          setIsMember(isMember);
        } catch (error) {
          console.error("Error checking membership:", error);
        }
      }
    };
  
    checkMembership();
  }, [data, userId]);
  

  const handleMembers = async () => {
    setIsUpdating(true);
    try {
      if (data && data.chatId) {
        const groupChatRef = collection(firestore, "GroupChat");
        const groupInfoRef = doc(groupChatRef, data.chatId);
    
        const groupInfoSnap = await getDoc(groupInfoRef);
     
        let existingMembers = groupInfoSnap.data()?.groupInfo?.members || [];
        existingMembers = existingMembers.reduce((acc, val) => acc.concat(val), []);
    
        if (existingMembers.includes(userId)) {
          const updatedMembers = arrayRemove(existingMembers, userId);
          // await updateDoc(groupInfoRef, { "groupInfo.members": updatedMembers });
          await updateDoc(groupInfoRef, {
            "groupInfo.members":  arrayRemove(userId)
          });
        } else {
          const updatedMembers = [...existingMembers, userId];
          await updateDoc(groupInfoRef, { "groupInfo.members": updatedMembers });
        }
        setIsMember(!isMember);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };
  
  
  

  return { isUpdating, isMember, handleMembers, data};
};

export default useMembers;
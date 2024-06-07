import { useState } from "react";
import { doc, setDoc, getFirestore, collection, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useGetVotes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const firestore = getFirestore();

  const upVoting = async (answerId, uid) => {
    try {
      
      var count=0;
      setIsLoading(true);
      const queryCollectionRef = collection(firestore, "answer");
      const answerDocRef = doc(queryCollectionRef, answerId);

      const answerDocSnap = await getDoc(answerDocRef);
      const existingDownVote = answerDocSnap.data()?.downVote || [];

      if (existingDownVote.includes(uid)) {
        const updatedDownVote = arrayRemove(...existingDownVote, uid);
        await updateDoc(answerDocRef, { downVote: updatedDownVote }); 
      }

      const existingUpVote = answerDocSnap.data()?.upVote || [];
      if (existingUpVote.includes(uid)) {
        showToast("Error", "You have already upvoted", "error");
        return 0;
      }
      
      const updatedUpVote = arrayUnion(...existingUpVote, uid);
      await updateDoc(answerDocRef, { upVote: updatedUpVote });

      showToast("Success", "Upvote submitted successfully", "success");
      return ++count;
    } catch (error) {
      showToast("Error", "Failed to upvote", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const downVoting = async (answerId, uid) => {
    try {
      setIsLoading(true);
      var count=0;
      const queryCollectionRef = collection(firestore, "answer");
      const answerDocRef = doc(queryCollectionRef, answerId);

      const answerDocSnap = await getDoc(answerDocRef);
      const existingUpVote = answerDocSnap.data()?.upVote || [];

      if (existingUpVote.includes(uid)) {
        const updatedUpVote = arrayRemove(...existingUpVote, uid);
        await updateDoc(answerDocRef, { upVote: updatedUpVote }); 
      }

      const existingDownVote = answerDocSnap.data()?.downVote || [];
      if (existingDownVote.includes(uid)) {
        showToast("Error", "You have already downvoted", "error");
        return 0;
      }
      const updatedDownVote = arrayUnion(...existingDownVote, uid);
      await updateDoc(answerDocRef, { downVote: updatedDownVote });

      showToast("Success", "Downvote submitted successfully", "success");
      return --count;
    } catch (error) {
      showToast("Error", "Failed to downvote", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, upVoting, downVoting };
};

export default useGetVotes;

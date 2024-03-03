import { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { storage } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useDeleteAnswer = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const firestore = getFirestore();

  const deleteAnswer = async (queryId) => {
    try {
      setIsDeleting(true);

      const answerCollectionRef = collection(firestore, "answer");
      const q = query(answerCollectionRef, where("uid", "==", authUser.uid), where("queryId", "==", queryId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(answerCollectionRef, docToDelete.id));

        const storageRef = ref(storage, `answer/${queryId}/${authUser.uid}.txt`);
        await deleteObject(storageRef);

        showToast("Success", "Answer deleted successfully", "success");
      } else {
        showToast("Error", "Answer not found", "error");
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      showToast("Error", "Failed to delete answer", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteAnswer, setIsDeleting }; 
};

export default useDeleteAnswer;

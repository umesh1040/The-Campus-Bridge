import { useState } from "react";
import { ref, deleteObject, listAll  } from "firebase/storage";
import { doc, deleteDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { storage } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useDeleteQuery = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const firestore = getFirestore();

  const deleteQuery = async (queryId) => {
    try {
      setIsDeleting(true);

      const queryCollectionRef = collection(firestore, "query");
      const q = query(queryCollectionRef, where("uid", "==", authUser.uid), where("queryId", "==", queryId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const answerCollectionRef = collection(firestore, "answer");
        const answerQuery = query(answerCollectionRef, where("queryId", "==", queryId));
        const answerSnapshot = await getDocs(answerQuery);

        const folderRef = ref(storage, `answer/${queryId}/`);
        try {
          const files = await listAll(folderRef);
          await Promise.all(files.items.map(async (fileRef) => {
            await deleteObject(fileRef);
          }));
        } catch (error) {
          console.error(`Error deleting folder`, error);
        }
        
        answerSnapshot.forEach(async (answerDoc) => {
          await deleteDoc(doc(answerCollectionRef, answerDoc.id));
        });

        
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(queryCollectionRef, docToDelete.id));

        const storageRef = ref(storage, `query/${queryId}.txt`);
        await deleteObject(storageRef);

        showToast("Success", "Query deleted successfully", "success");
      } else {
        showToast("Error", "Query not found", "error");
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      showToast("Error", "Failed to delete query", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteQuery, setIsDeleting };
};

export default useDeleteQuery;

import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getFirestore, collection,Timestamp } from "firebase/firestore";
import { storage } from "../firebase/firebase"; 
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useCreateQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const firestore = getFirestore();

  const create = async (inputs) => {
    if (!inputs.content || !inputs.title || !inputs.keywords) {
      showToast("Error", "Please confirm all the fields once again", "error");
      return;
    }

    try {
      setIsLoading(true);
      const queryCollectionRef = collection(firestore, "query");
      const newQueryRef = doc(queryCollectionRef);

      const storageReff = ref(storage, `query/${newQueryRef.id}.txt`);
      await uploadString(storageReff, inputs.content, 'raw');
      const downloadUrl = await getDownloadURL(storageReff);
      
      const userDoc = {
        queryTitle: inputs.title,
        queryKeywords: inputs.keywords,
        queryContent: downloadUrl,
        queryId: newQueryRef.id,
        uid: authUser.uid,
        createdAt:   Timestamp.now(),
      };

      await setDoc(newQueryRef, userDoc);

      showToast("Success", "Query created successfully", "success");
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      showToast("Error", "Failed to create query", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, create };
};

export default useCreateQuery;

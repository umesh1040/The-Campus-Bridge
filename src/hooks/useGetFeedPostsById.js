import { useState, useEffect } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, query, where, doc, getDocs, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPostsById = (initialFeedType) => { 
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const { setUserProfile } = useUserProfileStore(); 
  let q;
  let unsubscribe;

  const getFeedPosts = async (feedType) => {
    setIsLoading(true);

    try {
      if (!authUser) {
        setIsLoading(false);
        setPosts([]);
        return;
      } 
        q = query(collection(firestore, "posts"));
      

      const querySnapshot = await getDocs(q);
      const feedPosts = [];

      querySnapshot.forEach((doc) => {
        if(initialFeedType === doc.id){
          feedPosts.push({ id: doc.id, ...doc.data() });
        }
      });
   
        feedPosts.sort((a, b) => b.createdAt - a.createdAt); 
      setPosts(feedPosts);
       
      unsubscribe = () => {};
    } catch (error) {  
    } finally {
      setIsLoading(false);
    }
  };

  // Call getFeedPosts when initialFeedType changes and when the component mounts
  useEffect(() => {
    getFeedPosts(initialFeedType);

    // Clean up function to unsubscribe when the component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initialFeedType]);

  // Return the function to allow calling it externally
  return { isLoading, posts, getFeedPosts };
};

export default useGetFeedPostsById;

import { useState, useEffect } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, query, where, doc, getDocs, getDoc, Timestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = (initialFeedType) => {
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

      let userDocRef;
      let userDocSnapshot;
      let existingFollowing;

      if (feedType === "following") {
        userDocRef = doc(collection(firestore, "users"), authUser.uid);
        userDocSnapshot = await getDoc(userDocRef);
        existingFollowing = userDocSnapshot.data()?.following || [];
        q = query(collection(firestore, "posts"), where("createdBy", "in", existingFollowing));
      }
      if (feedType === "all") {
        q = query(collection(firestore, "posts"));
      }
      if (feedType === "new") {
        const currentTimestamp = Timestamp.now();
        const threeDaysAgo = new Timestamp(
          currentTimestamp.seconds - (3 * 24 * 60 * 60),
          currentTimestamp.nanoseconds
        );
        q = query(collection(firestore, "posts"), where("createdAt", ">", threeDaysAgo));
      }
      if (feedType === "colleges") {
        userDocRef = doc(collection(firestore, "clguserId"), "clgIds");
        userDocSnapshot = await getDoc(userDocRef);
        const clgIdslist = userDocSnapshot.data()?.clgIdslist || [];
        q = query(collection(firestore, "posts"), where("createdBy", "in", clgIdslist));
      }

      const querySnapshot = await getDocs(q);
      const feedPosts = [];

      querySnapshot.forEach((doc) => {
        feedPosts.push({ id: doc.id, ...doc.data() });
      });

      if (feedType === "new") {
        feedPosts.sort((a, b) => b.likes.length - a.likes.length);
      } else {
        feedPosts.sort((a, b) => b.createdAt - a.createdAt);
      }

      setPosts(feedPosts);
      unsubscribe = () => {};
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      showToast("Error fetching feed posts. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeedPosts(initialFeedType);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initialFeedType]);

  return { isLoading, posts, getFeedPosts };
};

export default useGetFeedPosts;

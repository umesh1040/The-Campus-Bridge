import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, query, where, doc, onSnapshot, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const { setUserProfile } = useUserProfileStore();

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);

      if (!authUser || authUser.following.length === 0) {
        setIsLoading(false);
        setPosts([]);
        return;
      }

      try {
        const userDocRef = doc(collection(firestore, "users"), authUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const existingFollowing = userDocSnapshot.data()?.following || [];

        const q = query(collection(firestore, "posts"), where("createdBy", "in", existingFollowing));
        const unsubscribePosts = onSnapshot(q, (querySnapshot) => {
          const feedPosts = [];
          querySnapshot.forEach((doc) => {
            feedPosts.push({ id: doc.id, ...doc.data() });
          });

          feedPosts.sort((a, b) => b.createdAt - a.createdAt);
          setPosts(feedPosts);
        });

        return () => {
          unsubscribePosts();
        };
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) getFeedPosts();
  }, [authUser, showToast, setPosts, setUserProfile]);

  return { isLoading, posts };
};

export default useGetFeedPosts;

import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, doc, updateDoc,collection,onSnapshot,query, orderBy, where, } from "firebase/firestore";

const useFollowerUser = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();

  const handleFollowerUser = async () => {
    setIsUpdating(true);
    try{
      const usersRef = collection(firestore, "users");
      var  q2 = query(
          usersRef,
          where("uid", "==", authUser?.uid),
          orderBy("uid")
        );

        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
              users.push({ ...doc.data(), id: doc.id });
              localStorage.setItem("user-info",JSON.stringify(doc.data()));
          });
         

        });
      }catch (err) {      }
    try {
      const checkIsFollower =1;
      const currentUserRef = doc(firestore, "users", authUser.uid);
      const userToFollowOrUnfollowRef = doc(firestore, "users", userId);

      await updateDoc(currentUserRef, {
        followers: checkIsFollower
          ? arrayRemove(userId)
          : [...authUser.followers, userId],
      });

      await updateDoc(userToFollowOrUnfollowRef, {
        following: checkIsFollower
          ? arrayRemove(authUser.uid)
          : [...userProfile.following, authUser.uid],
      });

      try{
        const usersRef = collection(firestore, "users");
        var  q2 = query(
            usersRef,
            where("uid", "==", authUser?.uid),
            orderBy("uid")
          );

          const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id });
                localStorage.setItem("user-info",JSON.stringify(doc.data()));
            });


          });
        }catch (err) {        }
      localStorage.setItem(
        "user-info",
        JSON.stringify({
          ...authUser,
          followers: checkIsFollower
            ? authUser.followers.filter((uid) => uid !== userId)
            : [...authUser.followers, userId],
        })
      );
      setAuthUser({
        ...authUser,
        followers: authUser.followers.filter((uid) => uid !== userId),
      });
      if (userProfile)
        setUserProfile({
          ...userProfile,
          followers: userProfile.followers.filter((uid) => uid !== authUser.uid),
        });

      localStorage.setItem(
        "user-info",
        JSON.stringify({
          ...authUser,
          followers: checkIsFollower
            ? authUser.followers.filter((uid) => uid !== userId)
            : [...authUser.followers, userId],
        })
      );

      setIsFollower(!checkIsFollower);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      const isFollower = authUser.followers.includes(userId);
      setIsFollower(isFollower);
    }
  }, [authUser, userId]);

  return { isUpdating, isFollower, handleFollowerUser,userProfile };
};

export default useFollowerUser;

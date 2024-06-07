import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditInfo= () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

	const showToast = useShowToast();

	const editInfo= async (inputs) => {
		setIsUpdating(true); 
		setIsUpdating(true); 
		const userDocRef = doc(firestore, "users", authUser.uid);
		try {
		const updatedUser = {
			...authUser,
			fullName: inputs.name || authUser?.fullName,
		 	city: inputs.city || authUser?.city, // Include city field
			collegeName: inputs.collegeName || authUser?.collegeName,
			country: inputs.country || authUser?.country,
			department: inputs.department || authUser?.department,
			gender: inputs.gender || authUser?.gender, 
			state: inputs.state || authUser?.state,
			studyYear: inputs.studyYear || authUser?.studyYear,
			yearOfGraduation: inputs.yearOfGraduation || authUser?.yearOfGraduation
		};
			await updateDoc(userDocRef, updatedUser);
			localStorage.setItem("user-info", JSON.stringify(updatedUser));
			setAuthUser(updatedUser);
			setUserProfile(updatedUser);
			showToast("Success", "Profile updated successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { editInfo, isUpdating };
};

export default useEditInfo;

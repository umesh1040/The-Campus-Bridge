import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where, Timestamp } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useSignUpWithEmailAndPassword = () => {
	const [createUserWithEmailAndPassword, , loading, error] = useCreateUserWithEmailAndPassword(auth);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	const signup = async (inputs) => {
		if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName ) {
			showToast("Error", "Please fill all the fields", "error");
			return;
		}
		
		const isUsernameValid = (/^[a-z0-9_-]+$/i.test(inputs.username) && !/\s/.test(inputs.username));
		if (!isUsernameValid) {
			showToast("Error","Username must be in lowercase and can contain (- _) without white spaces");
			return;
		}

		const isNameValid = /^[a-zA-Z\s]+$/.test(inputs.fullName);

		if (!isNameValid) {
			showToast("Error","Name must be in alphabets only");
			return;
		}

		const usersRef = collection(firestore, "users");

		const q = query(usersRef, where("username", "==",inputs.username.trim().toLowerCase()));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			showToast("Error", "Username already exists", "error");
			return;
		}

		try {
			const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
			if (!newUser && error) {
				showToast("Error", error.message, "error");
				return;
			}
			if (newUser) {
				const userDoc = {
					uid: newUser.user.uid,
					email: inputs.email,
					username: inputs.username.trim().toLowerCase(),
					fullName: inputs.fullName,
					bio: "",
					profilePicURL: "https://firebasestorage.googleapis.com/v0/b/the-campus-bridge.appspot.com/o/profilePics%2Fprofile.png?alt=media&token=5901e6ee-52c1-4d13-a895-7444ae22d708",
					followers: [],
					following: [],
					posts: [],
					createdAt:  Timestamp.now(),
				};
				await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
				await setDoc(doc(firestore, "userChats", newUser.user.uid), {});
				localStorage.setItem("user-info", JSON.stringify(userDoc));
				loginUser(userDoc);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;

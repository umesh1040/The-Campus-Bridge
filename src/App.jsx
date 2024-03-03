import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import QueryPage from "./pages/QueryPage/QueryPage";
import AnswerQuery from "./components/Query/Answer/AnswerQuery";
import ChatPage from "./pages/ChatPage/ChatPage";
import StudyPage from "./pages/StudyPage/StudyPage";
import UploadPDF from "./components/Study/StudyUpload";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ManageUsers from "./pages/ProfilePage/ManageUsers";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

function App() {
	const [authUser] = useAuthState(auth);
	return (
		<PageLayout>
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
				<Route path='chat/:username' element={authUser ? <ChatPage /> : <Navigate to='/auth' />} />
				<Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
				<Route path='/:username' element={authUser ? <ProfilePage /> : <Navigate to='/auth' /> } />
				<Route path='users/:username' element={authUser ? <ManageUsers /> : <Navigate to='/auth' /> } />
				<Route path='/query' element={authUser ? <QueryPage /> : <Navigate to='/auth' /> } />
				<Route path='/query/:queryId' element={authUser ? <AnswerQuery /> : <Navigate to='/auth' /> } />
				<Route path='/study' element={authUser ? <StudyPage /> : <Navigate to='/auth' /> } />
				<Route path='/upload' element={authUser ? <UploadPDF /> : <Navigate to='/auth' /> } />
			</Routes>
		</PageLayout>
	);
}

export default App;

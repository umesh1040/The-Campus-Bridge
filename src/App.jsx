import { Navigate, Route, Routes } from "react-router-dom";
import Landing_page from "./pages/HomePage/landing_page";
import HomePage from "./pages/HomePage/HomePage";
import QueryPage from "./pages/QueryPage/QueryPage";
import AnswerQuery from "./components/Query/Answer/AnswerQuery";
import ChatPage from "./pages/ChatPage/ChatPage";
import StudyPage from "./pages/StudyPage/StudyPage";
import StudyView from "./components/Study/StudyView";
import UploadPDF from "./components/Study/StudyUpload";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ManageUsers from "./pages/ProfilePage/ManageUsers";
import SharePost from "./components/FeedPosts/SharePost";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

function App() {
 const [authUser] = useAuthState(auth);
 return (
	<PageLayout>
		<Routes>
			<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/main' />} />
			<Route path='/main' element={!authUser ? <Landing_page /> : <Navigate to='/'  />} />
			<Route path='chat/:username' element={authUser ? <ChatPage /> : <Navigate to='/main' />} />
			<Route path='/auth/:form' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
			<Route path='/:username' element={authUser ? <ProfilePage /> : <Navigate to='/main' /> } />
			<Route path='users/:username' element={authUser ? <ManageUsers /> : <Navigate to='/main' /> } />
			<Route path='posts/:postId' element={authUser ? <SharePost /> : <Navigate to='/main' /> } />
			<Route path='/query' element={authUser ? <QueryPage /> : <Navigate to='/main' /> } />
			<Route path='/query/:queryId' element={authUser ? <AnswerQuery /> : <Navigate to='/main' /> } />
			<Route path='/study' element={authUser ? <StudyPage /> : <Navigate to='/main' /> } />
			<Route path='/study/view' element={authUser ? <StudyView /> : <Navigate to='/main' /> } />
			<Route path='/upload' element={authUser ? <UploadPDF /> : <Navigate to='/main' /> } />
		</Routes>
	</PageLayout>
	);
}

export default App;

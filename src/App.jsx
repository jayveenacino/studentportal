import Body from './Body';
import Home from './Home';
import Signup from './student/Signup';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
import Root from './Root';
import Create from './student/Create';
import Login from './student/Login';
import AdminLogin from './Admin/Adminlogin';
import Notice from './student/Notice';
import AdminDashboard from './Admin/Admindashboard';
import Preregister from './student/Preregister';
import PrivateRoute from './student/PrivateRoute';
import { AdminContextProvider } from './Admin/useAdmin';
import Student from './student/Student';
import StudentMain from './StudentPortalMain/StudentMain';
import PresidentOffice from './HomePage/PresidentOffice';
import NotFound from './pages/NotFound';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Root />}>
			<Route index element={<Home />} />
			<Route path="home" element={<Home />} />
			<Route path="body" element={<Body />} />
			<Route path="body/signup" element={<Signup />} />
			<Route path="signup" element={<Signup />} />
			<Route path="signup/create" element={<Create />} />
			<Route path="signup/create/notice" element={<Notice />} />
			<Route path="signup/notice" element={<Notice />} />
			<Route path="login" element={<Login />} />
			<Route path="login/notice" element={<Notice />} />
			<Route path="preregister/notice" element={<Notice />} />
			<Route path="auth/secure-access/admin-portal/login" element={<AdminLogin />} />
			<Route path="auth/secure-access/admin-portal/admindashboard" element={<AdminDashboard />} />
			<Route path="student" element={<Student />} />
			<Route path="studentmain" element={<StudentMain />} />
			<Route path="home/collegepresident" element={<PresidentOffice />} />
			<Route
				path="preregister"
				element={
					<PrivateRoute>
						<Preregister />
					</PrivateRoute>
				}
			/>

			<Route path="pages/NotFound" element={<NotFound />} />
			<Route path="*" element={<Navigate to="/pages/NotFound" replace />} />
		</Route>
	)
);

export default function App() {
	return (
		<AdminContextProvider>
			<RouterProvider router={router} />
		</AdminContextProvider>
	);
}

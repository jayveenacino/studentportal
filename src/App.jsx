import Body from './Body';
import Home from './Home';
import Signup from './student/Signup';
import Create from './student/Create';
import Login from './student/Login';
import Adminlogin from './Admin/Adminlogin';
import Notice from './student/Notice';
import AdminDashboard from './Admin/Admindashboard';
import Preregister from './student/Preregister';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

import Root from './Root';

function App() {
	return (
		<Router>
			<Routes>
				{/* Root layout with nested routes */}
				<Route path="/" element={<Root />}>
					{/* INDEX SESSION */}
					<Route index element={<Body />} />
					<Route path="home" element={<Home />} />

					{/* STUDENT SESSION */}
					<Route path="signup" element={<Signup />} />
					<Route path="signup/create" element={<Create />} />
					<Route path="login" element={<Login />} />
					<Route path="preregister" element={<Preregister />} />
					<Route path="login/notice" element={<Notice />} />
					<Route path="preregister/notice" element={<Notice />} />

					{/* ADMIN SESSION */}
					<Route path="adminlogin" element={<Adminlogin />} />
					<Route path="admindashboard" element={<AdminDashboard />} />

					{/* Fallback redirect */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
		</Router>
	);
}
// const router = createBrowserRouter(
// 	createRoutesFromElements(
// 		<Route element={<Root />}>
// 			{/* INDEX SESION */}
// 			<Route index element={<Body />} />
// 			<Route path="home" element={<Home />} />
// 			{/* STUDENT SESION */}
// 			<Route path="signup" element={<Signup />} />
// 			<Route path="signup/create" element={<Create />} />
// 			<Route path="login" element={<Login />} />
// 			<Route path="preregister" element={<Preregister />} />
// 			<Route path="login/notice" element={<Notice />} />
// 			<Route path="preregister/notice" element={<Notice />} />
// 			{/* ADMIN SESION */}
// 			<Route path="adminlogin" element={<Adminlogin />} />
// 			<Route path="admindashboard" element={<AdminDashboard />} />
// 			<Route path="*" element={<Navigate to="/" />} />
// 		</Route>
// 	)
// );

// export default function App() {
// 	return <RouterProvider router={router} />;
// }

export default App;

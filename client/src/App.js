import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import Home from "./components/Main/Home";
import About from "./components/Main/About";
import Contact from "./components/Main/Contact";
import Calculate from "./components/Main/Calculate";
import Admin from "./components/Admin/index";
import Adminforgot from "./components/Admin/adminforgot";
import Adminreset from "./components/Admin/adminreset";
// import Adminsignup from "./components/Admin/Signup";
import Adminhome from "./components/Admin/Adminhome";

function App() {
	const user = localStorage.getItem("token");
	const admin = localStorage.getItem("token1")
	console.log(user,admin);
  
	return (
		<Routes>
			
			<Route path="/signup" exact element={<Signup />} />
			
			<Route path="/login" exact element={<Login />} />
			<Route path="/admin" exact element={<Admin />} />
			{/* <Route path="/admin/signup" exact element={<Adminsignup />} /> */}
			<Route path="/:id/verify/:token" element={<EmailVerify />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/admin/forgot-password" element={<Adminforgot />} />
			<Route path="/password-reset/:userId/:token" element={<PasswordReset />} />
			<Route path="/admin/password-reset/:userId/:token" element={<Adminreset/>} />
			{user && <Route path="/" exact element={<Home />} />}
			{user && <Route path="/home" exact element={<Home/>} />}
			{user && <Route path="/about" exact element={<About/>} />}
			{user && <Route path="/contact" exact element={<Contact/>} />}
			{user && <Route path="/calculate" exact element={<Calculate/>} />}
			{admin && <Route path="/adminhome" exact element={<Adminhome/>} />}
			<Route path="*" element={<Navigate replace to="/login" /> } />
		</Routes>
	);
}

export default App;
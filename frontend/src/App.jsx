import React from "react";
import {Navigate,Routes,Route,useLocation} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Blogs from "./pages/Blogs.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./context/AuthProvider.jsx";
import Creator from "./pages/Creator.jsx";
import { Toaster } from "react-hot-toast";
import UpdateBlog from "./dashboard/UpdateBlog.jsx";
import Detail from "./pages/Detail.jsx";
import NotFound from "./pages/Notfound.jsx";
function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
    location.pathname
  );
   const { blogs, isAuthenticated } = useAuth();
  let token = localStorage.getItem("jwt"); 
  console.log(blogs);
  console.log(isAuthenticated);
  
  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
    {/* Defining Routes */}
    <Routes>
      <Route exact path="/blogs" element={<Blogs />} />
      <Route exact path="/" element={isAuthenticated=== true ?<Home />: <Navigate to="/login" />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/creators" element={<Creator />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/blogs/update/:id" element={<UpdateBlog />} />
      <Route exact path="/blogs/:id" element={<Detail />} />
      {/* Universal route */}
        <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
     {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;

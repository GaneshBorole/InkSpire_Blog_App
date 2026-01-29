import React from 'react'
import { useAuth } from '../context/AuthProvider';
import Sidebar from '../dashboard/Sidebar';
import MyProfile from '../dashboard/MyProfile';
import CreateBlog from '../dashboard/CreateBlog';
import UpdateBlog from '../dashboard/UpdateBlog';
import MyBlogs from '../dashboard/MyBlogs';
// import { Navigate } from 'react-router-dom';



function Dashboard() {
  const {profile, isAuthenticated} = useAuth();
  const [component, setComponent] = React.useState("My Profile");
  console.log(profile?.user);
  console.log(isAuthenticated);
  // if (!isAuthenticated) {
  //   return <Navigate to={"/"} />;
  // }
  
  
  return (
    <div>
    <Sidebar component={component} setComponent={setComponent} />
        {component === "My Profile" ? (
          <MyProfile />
        ) : component === "Create Blog" ? (
          <CreateBlog />
        ) : component === "Update Blog" ? (
          <UpdateBlog />
        ) : (
          <MyBlogs />
        )}
    </div>
  )
}

export default Dashboard
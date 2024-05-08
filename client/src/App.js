import './index.css';
import {Outlet,Route,Routes,Navigate,useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {Home,Profile,Login,Register,Resetpassword} from "./Component"

function Layout(){
  const {user} = useSelector(state=>state.user);
  const location = useLocation();

  console.log(user)

  return user?.token?(
    <Outlet/>
  ):(
    <Navigate to='/login' state={{from:location}}  replace />
  )
}


function App() {
  const theme = useSelector(state=>state.theme);
  console.log(theme);

  return (
   <div className='data-theme={theme} w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route  path='/' element={<Home />} />
          <Route  path='/profile/:id' element={<Profile />} />
        </Route>
        <Route  path='/register' element={<Register />} />
        <Route  path='/login' element={<Login />} />
        <Route  path='/reset-password' element={<Resetpassword />} />
      </Routes>
   </div>
  );
}

export default App;

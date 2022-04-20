import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage"
import Profile from "./pages/Profile"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ProfileEdit from './pages/Profile/ProfileEdit';
import RestaurantEdit from './pages/RestaurantPage/RestaurantEdit';
import CreateRestaurant from './pages/RestaurantPage';
import AllRestaurants from "./pages/AllRestaurants";
import Menu from './components/Menu';
import Blog from './components/Blog';
import ViewRestaurant from './pages/RestaurantPage/ViewRestaurant';
import NavBar from "./components/Layout/nav_bar";
import OwnerNotifs from "./components/Notifications/owner";
import UserNotifs from "./components/Notifications/user";
import SortedRestaurants from './pages/SortedRestaurants';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavBar />}>
            <Route index element={<LandingPage />}/>
            <Route path="profile" element={<Profile />} />
            <Route path="signup" element={<SignUp/>}/>
            <Route path="signin" element={<SignIn/>}/>
            <Route path="profile/edit" element={<ProfileEdit/>}/>
            <Route path="profile/restaurant/:id/edit" element={<RestaurantEdit/>}/>
            <Route path='profile/create/restaurant' element={<CreateRestaurant/>}/>
            <Route path='restaurants/:id/menu/add' element={<Menu/>}/>
            <Route path='restaurants/:id/blog/add' element={<Blog/>}/>
            <Route path="restaurants" element={<AllRestaurants/>}/>
            <Route path="restaurants/search" element={<SortedRestaurants/>}/>
            <Route path="restaurants/:id" element={<ViewRestaurant/>}/>
            <Route path="/notifications/user" element={<UserNotifs/>}/>
            <Route path="/notifications/owner" element={<OwnerNotifs/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

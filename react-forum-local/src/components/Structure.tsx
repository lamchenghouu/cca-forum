/*
  This is the modularised component which you can see surround most webpages.

  It consists of the navbar and sidebar. It loads the main content as annotated later on. 

  I used bootstrap mainly for the navigation bar support and some buttons.

  However, I have a variation of self-designed buttons, and buttons which uses bootstrap class props. 

  I think I have become quite intermediate at CSS.
*/

import axios from "axios";
import { useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom";


const Structure = (props: any) => {
  const [nav_msg, setNavMsg] = useState(''); // Red (white shadow) msg which appears on top nav bar 
  const [loggedInUser, setLoggedInUser] = useState('NONE'); // logged in User's user_name 
  const [loggedInUserId, setloggedInUserId] = useState(0); 
  const [no_posts, setNoPosts] = useState(0); // no. posts of the logged in user 
  const [loggedIn, setLoggedIn] = useState(false); // whether a user is logged in
  const location = useLocation(); // to extract nav_msg from <Navigate />

  useEffect( () => {
    (
        async () => {
            const {data} = await axios.get("user"); 

            if (data.response === "You are not allowed to access this page.") {
              setLoggedIn(false);
              setLoggedInUser("Logged out");
              setNoPosts(0); 
            } else {
              setLoggedIn(true); 
              setLoggedInUser(data.data.user_name); 
              setloggedInUserId(data.data.id);
              setNoPosts(data.no_posts);   
            }

            try {
              setNavMsg(location.state.nav_msg)
            } catch (e) {
              setNavMsg("")
            }
        } 
    )()
  }, []) // these are variables that upon change, will recurse the function

  return (
    <> {/* these replace overarching <html></html> tags */}
      <div id="main_content"> 
        {props.children} {/* loads whatever <Structure></Structure> surrounds */}
      </div>

      <div className="sidebar">  
        <p className="comfortaa orangetxt" id="sidebar-react">Powered by: <span className="bluetxt">React</span> <img src="./images/default_react_logo.png" width="30"/></p>
        <div id="profilebox" className="comfortaa sidebar-profile-text"> 
          👤:&nbsp;
          { loggedInUser == "Logged out"
            ? <>
                <b className="blue-txt2">{loggedInUser}</b><br /><br />
                <p className="bluetxt">In order to access profile, please (register &) login.<br /></p>
                <p className="orangetxt">Happy threading~</p>
              </>
            : <>
                <b className="bluetxt">{loggedInUser}</b>
                <a type="button" 
                   href="/editprofile" 
                   className="profile-button btn btn-outline-secondary">✏️Edit your profile
                </a>
                <a type="button" 
                   href={`/posts/user/${loggedInUserId}/0`} 
                   className="profile-button btn btn-outline-secondary">👀View your posts
                </a><br/>
                📄Number of posts: <b className="bluetxt">{no_posts}</b><br/>
                🍟Potatoes: <b className="bluetxt">{no_posts * 2}</b>
              </>
          }
        </div>         
        
        <a href="/" className="sidebarbutton">Home</a>
        <a href="/about" className="sidebarbutton">About / Updates</a>
        <a href="/posts/all/0/0" className="sidebarbutton">Posts</a>
        <a href="/taglist" className="sidebarbutton">Trending Tags</a>
        <a href="#" className="sidebarbutton">Back to Top ↟↟</a>
      
        <div id="bottom_desc">
          <span className="sidebar-tiny-text">
            <br />
            Developed in preparation for CVWO.
            <br /> 
            For educational purposes only.<br /> 
            Image credits to <a href="https://www.freepik.com/free-vector/boys-playing-football-together-two-happy-little-kids-playing-sport-uniforms-smiling-children-kicking-ball-by-foot-them-white-background_24758143.htm#page=2&query=soccer%20kicking%20cartoon&position=7&from_view=search&track=ais">studio4rt on Freepik</a>, <a href="https://www.freepik.com/free-vector/male-artist-painter-cartoon-illustration-people-profession-icon-concept_10244976.htm#query=artist%20cartoon&position=26&from_view=search&track=sph">catalyststuff on Freepik</a>, and NUS + React for their logo. Background designed on Canva Education.<br/>
            Developed by Lam Cheng Hou (<span className="bluetxt">NUS </span><span className="orangetxt">CS</span>).
          </span>
        </div>
      </div>
 
      {/* bootstrap navbar
      color scheme: navbar-dark bg-dark 
      sticky-top: to prevent profile bar from covering top bar */}
      <nav className = "navbar navbar-dark bg-dark sticky-top flex-md-nowrap">
        {/* .navbar-brand for project name 
        md/lg - medium/large sized devices
        m - margin, p - padding
        t/b/l/r/x(l&r)/y(t/b)*/}
        <a className="text-center navbar-brand col-md-3 col-lg-2 px-3" href="/"><span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" /></a> 

        <ul className="nav nav-pills nav-fill" id="top-bar-style">
          <h6 id="nav_msg">{nav_msg}</h6>
          <li className="nav-item rightify">
            <a className="nav-link active" href="/">Home</a>
          </li>
          &ensp;
          { loggedIn 
            ? <>
                <li className="nav-item rightify">
                  <a className="nav-link active" href ="/posts/all/0/0">Posts</a>
                </li>&ensp;
                <li className="nav-item rightify">
                  <a className="nav-link active" href="/logout">Logout</a>
                </li>
              </>
            : <><li className="nav-item">
                  <a className="nav-link active" href ="/register">Register</a>
                </li>&ensp;
                <li className="nav-item rightify"><a className="nav-link active" href="/login">Login</a>
                </li></>
            }
          &ensp;&ensp;
        </ul> 
      </nav> 
    </>
  );
}

export default Structure;
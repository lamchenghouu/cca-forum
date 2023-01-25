import { useEffect, useState } from "react"; 
import axios from "axios";
import Structure from "../components/Structure";
import { Remarkable } from "remarkable";

// class method 

const Homepage = () => {

    const [user_id, setUserId] = useState(0); // logged in user_id, to ascertain which buttons to display
    // if user_id >0, authorised user is logged in 
    const [topContent, setTopContent] = useState(''); // topPostContet
    const [topUser, setTopUser] = useState(''); // poster of topPost
    const [topLikes, setTopLikes] = useState(0); // likes of the topPost

    const markDown = new Remarkable();

    useEffect( () => {
        (
        async () => {

            const {data} = await axios.get("user"); 

            // as triggered by authentication middleware
            if (data.response !== "You are not allowed to access this page.") {
                setUserId(data.data.id);       
            } else {
                setUserId(0); 
            }

            const data2 = await axios.get("toppost"); 
            setTopContent(data2.data.content); 
            setTopUser(data2.data.user.user_name); 
            setTopLikes(data2.data.likes);
            
            
        })()
    }, [user_id])

    return (
        <Structure>
            <br /><br /><br />
            <h1 className="welcome_msg">Welcome to NUS' CCA Forum!</h1>
            <p className="welcome_desc">Where interests meet opportunities.</p>
            
            &nbsp;   
            { user_id > 0 
              ? <>
                    <a type="button" 
                       href="/posts/all/0/0" id="home-GTP-button" 
                       className="btn btn-outline-secondary">Go to Posts
                    </a>&nbsp;
                    <a type="button" 
                       href={`/posts/user/${user_id}/0`} 
                       className="homepage-adj-btn btn btn-outline-secondary">View your Posts
                    </a>&nbsp;
                    <a type="button" 
                       href="/createpost" 
                       className="homepage-adj-btn btn btn-outline-secondary">Create a Post
                    </a>
                </> 
              : <>
                    <a type="button" 
                    href="/login" 
                    className="homepage-adj-btn btn btn-outline-secondary"
                    id="home-GTP-button">Login to Access Features
                    </a>&nbsp;
                    <a type="button" 
                    href="/register" 
                    className="homepage-adj-btn btn btn-outline-secondary">Please Register
                    </a>   
                </> 
            } 
            {/* TOP POST */}
            <div>
                <h1 className="welcome_msg">Top Post <span id="top-post-likes">❤️{topLikes-1}</span></h1>
                <div id="top-post-content" className="scrollablespace2">
                    { user_id === 0 
                      ? <><span className="orangetxt squishtxt comfortaa"><i><u>Login to interact with this post!</u></i></span><br /><br /></>
                      : <></> 
                    }
                    <div dangerouslySetInnerHTML={{__html: markDown.render(topContent)}} /><br />
                    <span className="bluetxt">Posted by: {topUser}</span><br /><br />
                </div>
            </div> 
            {/* background design */}
            <img id="arts-sports" src="./images/arts_sports.png" />
        </Structure>
    );
}
 

export default Homepage; 
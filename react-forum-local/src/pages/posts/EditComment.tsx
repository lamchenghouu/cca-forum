import axios from "axios";
import { SyntheticEvent, useState, useEffect } from "react"; 
import { Navigate, useParams } from "react-router-dom";
import { Remarkable } from "remarkable";

// see README.txt for a detailed explanation on the routing logic between EditComment, EditPost, IndivPost, PostDisplay.tsx

const EditComment = () => {
    // placeholder, collect user input 
    const [content, setContent] = useState('');
    // redirection: redirect for success, unauthorised for unauthorised users
    const [redirect, setRedirect] = useState(false);
    const [unauthorised, setUnauthorised] = useState(false);
    const [post_id, setPostId] = useState(0); // for redirecting back to correct indivPost
    const [user_id, setUserId] = useState(0); // for redirecting back to correct userPost
    const [tag, setTag] = useState(''); // for redirecting back to correct tagPost
    
    let { mode, id } = useParams(); // get Params from URL
    
    const markDown = new Remarkable(); 

    useEffect(() => {
        (
            async () => {
      
                let {data} = await axios.get(`posts/comments/${id}`); 
              
                if (data.response === "You are not allowed to access this page.") {
                    setUnauthorised(true);
                }
                
                const data2 = await axios.get('user'); 
                
                if (data2.data.data.id !== data.user_id) { 
                    setUnauthorised(true); 
                }
                setContent(data.content);
                setPostId(data.post_id);
                setUserId(data.user_id);
                setTag(data.post.tag);

            }
        )()
    }, []);
    

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const {data} = await axios.put(`posts/comments/${id}`, {
            content
        });
       
        setRedirect(true); // we assume that everything goes well, thus no error message (block) 
    
    }

    if (unauthorised) { 
        return <Navigate to={'/'} state={{nav_msg: "You are not allowed to edit this comment!"}}/>
    }

    if (redirect) { // the last 'subpage' is the viewParam, which is the current comment section being viewed
        if (mode === 'indiv') { // from indivPost page 
            return <Navigate to={`/post/all/${post_id}`} state={{nav_msg: "Comment Updated!"}}/>
        } else if (mode === 'allposts' ) { // from posts (all users posts)
            return <Navigate to={`/posts/all/0/${post_id}`} state={{nav_msg: "Comment Updated!"}}/>
        } else if (mode === 'userposts') { // from a user's posts page
            return <Navigate to={`/posts/user/${user_id}/${post_id}`} state={{nav_msg: "Comment Updated!"}}/>
        } else if (mode === 'tagposts') { // from a tag's posts page 
            return <Navigate to={`/posts/tag/${tag}/${post_id}`} state={{nav_msg: "Comment Updated!"}}/>   
        }
        // MAIN PURPOSE: we want to redirect to the correct previous page 
    }
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin2 comfortaa">
                <span className="orangetxt">NUS</span> 
                <span className="bluetxt">CCA Forum</span>&ensp;
                <img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                <a type="button" // direct to previous page 
                   href={mode === "indiv" 
                         ? `/post/all/${post_id}` 
                         : mode === "user" 
                         ? `/posts/user/${user_id}/${post_id}` 
                         : mode === "tag" 
                         ? `/posts/tag/${tag}/${post_id}` 
                         : `/posts/all/0/${post_id}`} id="GTP_button" className="btn btn-secondary">Go back to Posts</a>

                <form onSubmit={submit}>
                    <h3 className="mb-3">Update your comment<span className="squishtxt">&ensp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Markdown Supported</span></h3>
                    <div className="squishtxt">Content</div>
                    <textarea className="form-control contentbox"         
                            defaultValue={content} required
                            onChange={e=>setContent(e.target.value)}
                    ></textarea>
                    
                    <div className="littleverticalgap"></div>
                    <span className="lighttext">Preview</span>
                    <div className="littleverticalgap"></div>
                    <div className="preview" dangerouslySetInnerHTML={{__html: markDown.render(content)}} /> 

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Update</button>           
                </form>
            </main>
        </div></>
    );
};

export default EditComment;

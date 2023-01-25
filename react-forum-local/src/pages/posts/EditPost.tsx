import axios from "axios";
import { SyntheticEvent, useState, useEffect } from "react"; 
import { Navigate, useParams } from "react-router-dom";
import { Remarkable } from "remarkable";

// see README.txt for a detailed explanation on the routing logic between EditComment, EditPost, IndivPost, PostDisplay.tsx

const EditPost = () => {

    let { mode, id } = useParams(); // modes: 'user', 'all', 'indiv' 
    // placeholder, collect user input
    const [content, setContent] = useState('');
    const [redirect, setRedirect] = useState(false);
  
    const [unauthorised, setUnauthorised] = useState(false);
    const [user_id, setUserId] = useState(0); // for redirecting to user's posts in 'user' mode 
    const [tag, setTag] = useState(''); // for redirecting to tag's posts in 'tag' mode 
    const markDown = new Remarkable(); 

    useEffect(() => {
        (
            async () => {
      
                let {data} = await axios.get(`post/${id}`); 
              
                if (data.response === "You are not allowed to access this page.") {
                    setUnauthorised(true);
                }
                
                const data2 = await axios.get('user'); 
                
                if (data2.data.data.user_name !== data.user.user_name) { 
                    setUnauthorised(true); 
                }
                setContent(data.content);
                setTag(data.tag); 
                setUserId(data2.data.data.id);
            }
        )()
    }, []);
    

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const {data} = await axios.put(`post/${id}`, {
            content
        });
       
        setRedirect(true); // we assume that everything goes well, thus no error message (block) 
        
    }

    if (unauthorised) { 
        return <Navigate to={'/'} state={{nav_msg: "You are not allowed to edit this post!"}}/>
    }

    if (redirect) {  // navigate to correct previous page
        return mode === "indiv"
               ? <Navigate to={`/post/all/${id}`} state={{nav_msg: "Post Updated!"}} />
               : mode === "user"
               ? <Navigate to={`/posts/user/${user_id}/0`} state={{nav_msg: "Post Updated!"}} />
               : mode === "tag" 
               ? <Navigate to={`/posts/tag/${tag}/0`} state={{nav_msg: "Post Updated!"}} />
               : <Navigate to={`/posts/all/0/0`} state={{nav_msg: "Post Updated!"}} />; // mode === "all"
    }
    
    return ( 
        <>
        <div className="background-img"> 
            <main className="form-signin2 comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                
                <a type="button" // navigate to correct previous page
                   href={mode === "indiv" 
                         ? `/post/all/${id}` 
                         : mode === "user" 
                         ? `/posts/user/${user_id}/0` 
                         : mode === "tag" 
                         ? `/posts/tag/${tag}/0` 
                         : `/posts/all/0/0`} id="GTP_button" className="btn btn-secondary">Go back to Posts</a>

                <form onSubmit={submit}>

                    <h3 className="mb-3">Update your post<span className="squishtxt">&ensp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Markdown Supported</span></h3>
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

export default EditPost;

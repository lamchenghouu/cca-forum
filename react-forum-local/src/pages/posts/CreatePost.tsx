import axios from "axios";
import { SyntheticEvent, useState, useEffect } from "react"; 
import { Navigate } from "react-router-dom";
import { Remarkable } from "remarkable";

/*  Some notes:
dangerouslySetInnerHTML is for markdown support
*/

const CreatePost = () => {

    // collect user input 
    const [content, setContent] = useState('');
    const [tag, setTag] = useState(''); 
    // redirection & err
    const [unauthorised, setUnauthorised] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [err, setErr] = useState(''); // if tag is too long

    const markDown = new Remarkable() // for markdown support

    useEffect(() => {    
        (
          async () => {
            const {data} = await axios.get('user');
         
            if (data.response === "You are not allowed to access this page.") {
              setUnauthorised(true);
            }
            
          }
        )()
      }, []);

    if (unauthorised) {
        
        return <Navigate to={'/'} state={{nav_msg: "Unable to create post. Not signed in!"}}/>
    }

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        // accessing backend
        const {data} = await axios.post("/user/createpost", {
            content,
            tag
        })
        
        if (data.response !== "Post Created.") {
            setErr(data.response);
        } else {
            setRedirect(true);
        }
        
    }

    if (redirect) {
        return <Navigate to={'/posts/all/0/0'} state={{ nav_msg: "Post Created. "}} /> 
    }

    return ( 
        <>
        <div className="background-img"> 
            <main className="form-signin2 comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;

                <a type="button" href="/posts/all/0/0" id="GTP_button" className="btn btn-secondary">Go back to Posts</a>
                <form onSubmit={submit}>
                    <h3 className="mb-3">Create Post<span className="squishtxt">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Markdown Supported</span></h3>

                    <textarea className="form-control contentbox" placeholder="Content" required
                        onChange={e=>setContent(e.target.value)}>
                    </textarea><br />

                    <input type="text" className="form-control" 
                           placeholder="Tag" required
                           onChange={e=>setTag(e.target.value)} />

                    <div className="littleverticalgap"></div>
                    <span className="lighttext">Preview</span>

                    <div className="littleverticalgap"></div>
                    <div className="preview" dangerouslySetInnerHTML={{__html: markDown.render(content)}} /> 

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                    
                </form>
                <p className="err">{err}</p>
            </main>
        </div></>
    );
};

export default CreatePost;

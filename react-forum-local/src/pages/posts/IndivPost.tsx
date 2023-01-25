import axios from "axios";
import {useEffect, useState, SyntheticEvent } from "react"; 
import { Link, Navigate, useParams } from "react-router-dom";
import Structure from "../../components/Structure";
import { Comment } from "../../models/comment";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { Remarkable } from "remarkable";

// see README.txt for a detailed explanation on the routing logic between EditComment, EditPost, IndivPost, PostDisplay.tsx

const IndivPost = () =>  {
    let { mode, id } = useParams(); 
    // query post
    const [post, setPost] = useState(new Post(0,'',0,new User(0, ''), [], '', 0, ''));   
    // query user
    const [user_id, setUserId] = useState(0);
    const [userLikeStr, setUserLikeStr] = useState(''); // userLikeStr is the string of post Ids for which the posts are liked by the user     
    const [comment, setComment] = useState(''); // collet userinput 
    const [expand, setExpand] = useState(false); // overflow of commet content (expand function) 
    const [redirect, setRedirect] = useState(false);
    const [delRedirect, setDelRedirect] = useState(false); // redirecting trigger when you delete a post from indivPost page
    const [updateComments, setUpdateComments] =  useState(false); // refreshing of page
    const [disabled, setDisabled] =  useState(false); // disabling of like button
    

    const markDown = new Remarkable(); 

    // one weakness of the webapp is that if we go User-mode PostDisplay => Indiv Display => Edit Comment => Returns to Indiv Display, we will lose track of the initial starting point
    // thus, we return to ALL posts
    // can be easily circumvented by passing prevState, soon to be implemented

    useEffect(() => {    
        (
        async () => {
            const {data} = await axios.get(`post/${id}`);
        
            if (data.response === "You are not allowed to access this page.") {
            setRedirect(true);
            }
    
            setPost(data);

            const data2 = await axios.get('user'); // see who's signed in currently 
            
            setUserId(data2.data.data.id);
            setUserLikeStr(data2.data.data.likes)
        }
        )()
    }, [comment, updateComments, disabled]);

    if (redirect) {
        return <Navigate to={'/'} state={{nav_msg: "Unable to access post. Not signed in!"}}/>
    }

    if (delRedirect) { // rediret to correct previous page upon deletion of post in view 
        return mode === "user"
               ? <Navigate to={`/posts/user/${user_id}/0`} state={{nav_msg: "Post deleted successfully!"}}/>
               : mode === "tag"
               ? <Navigate to={`/posts/tag/${post.tag}/0`} state={{nav_msg: "Post deleted successfully!"}}/> 
               : <Navigate to={'/posts/all/0/0'} state={{nav_msg: "Post deleted successfully!"}}/>
    }

    //// ACCESSING BACKEND, LINKED WITH BUTTON CLICKS IN HTML BELOW ////

    const like = async (post_id: number) => { // triggers LikePost in backend
        await axios.post(`/post/${post_id}/like`);
        setUpdateComments(!updateComments); // very useful for reloading
        setDisabled(true); // timeout like button to account for buffering 
        setTimeout(() => setDisabled(false), 3000);
        
    }

    const del = async (id: number) => { 
        if (window.confirm("Are you sure you want to delete this post? ")) {
            await axios.delete(`post/${id}`)
            setDelRedirect(true);
        }
    }

    const delC = async (id: number) => { 
        if (window.confirm("Are you sure you want to delete this comment? ")) {
            await axios.delete(`posts/comments/${id}`)
        }
        setUpdateComments(!updateComments);
    }
    
    const toggle_expand = () => { // if the comment's content is too large 
        setExpand(!expand);
    } 
    
    const post_comment = async (e: SyntheticEvent) => {
        e.preventDefault();
        const {data} = await axios.post(`user/post/${id}/createcomment`, {
            content: comment
        })
    
        setComment(''); 
    }

    const isLikedByUser = (post_id: number) => { // for the red highlight for User's liked posts 
        var liked_posts = userLikeStr.split(" ");
        const exist = liked_posts.find(id => Number(id) === post_id ); 
        return exist;
    }

    // https://getbootstrap.com/docs/4.1/content/tables/
    {/* our goal is for view to drop as an animation style hide; select is a function which accepts the id and thereafter, does the appropriate show. overflow-hidden hides overflow, and strip above is removed to make the table neater */}

    return (
        <Structure>
            <a href={ mode === "user" 
                      ? `/posts/user/${user_id}/0`
                      : mode === "tag"
                      ? `/posts/tag/${post.tag}/0`
                      : '/posts/all/0/0'
                    }
               className="btn btn-secondary" id="indivGTPbutton">Go back to Posts</a>

            <div className="indiv_post_content scrollablespace2"> {/* post content is scrollable */}
                <div dangerouslySetInnerHTML={{__html: markDown.render(post.content)}} />
            </div>
            
            <div id="floatleft"> {/* Edit & Delete buttons stacked vertically */} 
                <div id="indivpostprofile">
                    Posted by: <span className="orangetxt"><b>{post.user.user_name}</b></span>
                </div>
                
                <div id="indivpostbutton">
                    <div id="floatleft">
                        {/* conditional, if it is your post, Edit & Delete buttons will show! */} 
                        {post.user_id === user_id 
                         ? <a href={`/editpost/indiv/${post.id}`}
                              className="btn btn-sm btn-outline-warning">
                            Edit ✍
                            </a> 
                         : <></>}<br/>

                        {post.user_id === user_id 
                         ? <a className="btn btn-sm btn-outline-warning" 
                              onClick={() => del(post.id)} >
                            Delete ✖
                            </a> 
                         : <></>}
                    </div>

                    <button className={isLikedByUser(post.id) 
                                       ? "btn btn-sm btn-outline-danger shaded_like" 
                                       : "btn btn-sm btn-outline-danger"} 
                            disabled={disabled} 
                            id="fatlikebutton" 
                            onClick={() => like(post.id)}>Like❤️</button>
                </div> 
                {/* different positions for the like count */}
                <span id={post.user_id === user_id 
                         ? "likes_display_indiv" 
                         : "likes-display-indiv2"}>{post.likes-1}</span>
            </div>
            {/* huge comment box */} 
            <form id="ignore-css-form-border" onSubmit={post_comment}>
                <textarea id="indivcommentbox" value={comment} placeholder="Enter your comment here (markdown supported)." required
                onChange={e=>setComment(e.target.value)}></textarea>
            
                <button id="indivcommentsubmit"className="btn btn-sm btn-primary" type="submit">Comment</button>
            </form>
            {/* scrollable comments section */} 
            <div className="scrollablespace">
                <br /><br />
                <table className="table table-sm" id="indivcommenttable">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th  className="col2comment">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* repetition control structure, to display all comments, each iteration generates a <tr></tr> which holds a Comment record */} 
                    {post.comments.map((c: Comment) => {
                        return (          
                            <tr className="comment">
                                <td>{c.user.user_name}</td>
                                
                                <td className="col2comment">
                                    <div dangerouslySetInnerHTML={{__html: markDown.render(expand ? c.content : c.content.slice(0, 150))}} />
                                    {/* text overflow expand feature */}
                                    <span className="bluetxt" onClick={toggle_expand}>
                                        {c.content.length > 150 
                                         ? (expand ? "show less" : "...see more") 
                                         : ""}
                                    </span>
                                </td>
                                <td className="col3">
                                {/* whether it is your own comment */}
                                {c.user.id === user_id 
                                 ? <Link to ={`/editcomment/indiv/${c.id}`}className="btn btn-sm btn-outline-info">Edit ✍</Link> 
                                 : <></>}
                                {c.user_id === user_id 
                                 ? <a className="btn btn-sm btn-outline-info" onClick={() => delC(c.id)} >Delete ✖</a> 
                                 : <></>}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </Structure>
  ); 
}

export default IndivPost;  

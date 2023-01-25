import axios from "axios";
import {useEffect, useState, SyntheticEvent } from "react"; 
import { Link, Navigate, useParams } from "react-router-dom";
import Structure from "../../components/Structure";
import { Comment } from "../../models/comment";
import { Post } from "../../models/post";

import { Remarkable } from "remarkable";

// see README.txt for a detailed explanation on the routing logic between EditComment, EditPost, IndivPost, PostDisplay.tsx

const UserPosts = () =>  {
  
  let { mode, id, viewParam } = useParams(); 
  // /posts/user||all||tag/:id/:viewParam // :id=0 for all // see README.txt
  
  // get all the posts using useEffect 
  const [posts, setPosts] = useState([]);
  // pagify 
  const [page, setPage] = useState(1); 
  const [lastPage, setLastPage] = useState(1); 
 
  const [redirect, setRedirect] = useState(false); // redirection
  const [view, setView] = useState(Number(viewParam)); // comment view that is opened
  const [user_id, setUserId] = useState(0); // current logged in user
  const [user_name, setUsername] = useState(''); // current logged in user
  const [comment_toggle, setCommentToggle] = useState(0);   // show / hide comment box 
  // get user input
  const [comment, setComment] = useState(''); 
  const [sort, setSort] = useState('d'); 
  const [tag, setTag] = useState('None'); 
  const [expand, setExpand] = useState(false); // expand overflow feature for posts
  const [expandC, setExpandC] = useState(false); // expand overflow feature for comments
  const [updateComments, setUpdateComments] =  useState(false); // updating comments
  const [disabled, setDisabled] =  useState(false); // disable like button due to buffer
  const [userLikeStr, setUserLikeStr] = useState(''); // user's like string to facilitate highlighting of liked posts
  const [dropDown, triggerDropdown] = useState(false); // dropdown for sort selection
  
  const initialTag = id; // for the top display in :mode=tag, it's okay if PostDisplay is in other modes, it simply does nothing!
  // 'd' for data, 'l' for likes
  const markDown = new Remarkable() 

  
  useEffect(() => {    
    (
      async () => { 
        
        const {data} = (mode === "user" 
                        ? await axios.get(`user/${id}/allposts?page=${page}&sort=${sort}`) 
                        : mode === "tag"
                        ? await axios.get(`post/tag/${id}?page=${page}&sort=${sort}`) // id will be the tag 
                        : await axios.get(`posts?page=${page}&sort=${sort}`)); // if mode === "all"

        // access contrl 
        if (data.response === "You are not allowed to access this page.") {
          setRedirect(true);
        } else {
          setLastPage(data.page_details.last_page)
          
          setPosts(data.data);
          // first data is from axios, 2nd is backend response

          const data2 = await axios.get('user'); 
          
          setUserId(data2.data.data.id);
          setUsername(data2.data.data.user_name)
          setUserLikeStr(data2.data.data.likes)
        }
      }
    )()
  }, [page, comment_toggle, updateComments, disabled, sort, tag]);

  if (redirect) {
    return <Navigate to={'/'} state={{nav_msg: "Unable to access posts. Not signed in!"}}/>
  }

  // show and hide styling for comment section targeted 
  const hide = { 
    maxHeight: 0,
    transition: '1000ms ease-in' 

  }   
  const show = {
    maxHeight: '200px',
    transition: '1000ms ease-out' 
  }

  // pagify
  const next = () => {
    if (page < lastPage) {
      setPage(page + 1)
    }
    
  }

  const previous = () => {
    if (page > 1) { 
      setPage(page - 1)
    }
   
  }

  // liking, deleting and commenting
  const like = async (post_id: number) => {
    await axios.post(`/post/${post_id}/like`);
    setUpdateComments(!updateComments); // very useful for reloading
    setDisabled(true);
    setTimeout(() => setDisabled(false), 3000);
    
  }

  const del = async (id: number) => { // deleting post
    if (window.confirm("Are you sure you want to delete this post? ")) {
      await axios.delete(`post/${id}`)
      setPosts(posts.filter((p: Post) => p.id !== id))
    }
  }
  
  const delC = async (id: number) => { // deleting comment
    if (window.confirm("Are you sure you want to delete this comment? ")) {
        await axios.delete(`posts/comments/${id}`)
        //setPost(new Post(0,'',0,new User(0, ''), [])); 
    }
    setUpdateComments(!updateComments);
  }

  const post_comment = async (e: SyntheticEvent) => {
    e.preventDefault();
    const {data} = await axios.post(`user/post/${comment_toggle}/createcomment`, {
        content: comment
    })
    setView(comment_toggle);
    setCommentToggle(0); // close comment window
    
  }

  const get_view = (id: number) => { // set the view when you press the 'View Comments' button on a post
    setView(view === id ? 0 : id);
  }
  
  const get_comment_view = (id: number) => { // toggles the comment INPUT box once you press the 'Comment' button on a post
    setCommentToggle(comment_toggle === id ? 0 : id);
  } 

  const toggle_expand = () => { // toggle expand for overflowed post content, regretably, this will trigger all expands, will be fixed in a patch update 
    setExpand(!expand);
  } 

  const toggle_expandC = () => { // toggle expand for overflowed comment content, ^
    setExpandC(!expandC);
  } 
  

  const isLikedByUser = (post_id: number) => { // checks if a post is liked by a user, it affects the style as shown below
    var liked_posts = userLikeStr.split(" ");
    const exist = liked_posts.find(id => Number(id) === post_id ); 
    return exist;
  }

  // https://getbootstrap.com/docs/4.1/content/tables/
  {/* our goal is for view to drop as an animation style hide; select is a function which accepts the id and thereafter, does the appropriate show. overflow-hidden hides overflow, and strip above is removed to make the table neater */}

  return (
    <Structure>
      <a className="post-display-brand" href="/"><span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" /></a>

      <a type="button" href="/createpost " className="btn btn-outline-secondary postButton greenAnchor">Create Post</a>
      
      <span className="postdisplaytopmsg">
        {mode === "user" 
         ? user_name + "'s" 
         : mode === "tag" 
         ? "tag:"+initialTag 
         : "ALL"} Threads:
      </span>

      {/* Sort by drop down button */}
      <button type="button" className="filter_button btn btn-secondary btn-md dropdown-toggle" data-toggle="dropdown" onClick={() => triggerDropdown(!dropDown)}>
        <span>Sort by...</span>
      </button>
      
      <div className={dropDown ? "dropdown-menu show" : "dropdown-menu"} id="filter_dropdown">
        <a className="dropdown-item" onClick={() => {triggerDropdown(!dropDown); setSort("d");}}>Date Posted</a>
        <a className="dropdown-item" onClick={() => {triggerDropdown(!dropDown); setSort("l");}}>Popularity (Likes)</a>
      </div>

      {/* pagify buttons */}
      <a type="button" onClick={previous} className="btn btn-outline-secondary prevButton greenAnchor">Previous</a>
      <a type="button" onClick={next} className="btn btn-outline-secondary nextButton greenAnchor">Next</a>
       
      <div className="table-responsive">
        <table className="table table-striped table-hover special_tables">
          <thead>
            <tr>
              <th className="col1">ID</th>
              <th className="col2">Content</th>
              <th></th>
              <th className="col4" colSpan={2}>
                &emsp;&emsp;&emsp;&emsp;&emsp;
                {/* Search by tag feature input */}
                <form action={`/posts/tag/${tag}/0`}   
                     className="ignore_css">
                  <input type="search" 
                         placeholder="  Search Posts by Tag"  
                         id="tag-search"
                         onChange={e=>setTag(e.target.value)}/> 

                  <input type="submit" 
                         id="tag-search-submit" 
                         value="🔎" 
                         className="tag-search-submit" />
                </form>
              </th>
            </tr>
          </thead>
          <tbody>
          
          {posts.map((p: Post) => {
            return (
            <> 
              <tr className="data_row" key={p.id}>
                <td className="col1">{p.id}</td>

                <td className="col2"> {/* main content */}

                  <a href={`/post/${mode}/${p.id}`}>
                    <div dangerouslySetInnerHTML={{__html: markDown.render(expand ? p.content : p.content.slice(0, 150))}} />
                  </a>

                  <span className="bluetxt" onClick={toggle_expand}>{p.content.length > 150 ? (expand ? "show less" : "...see more") : ""}</span>

                </td>

                <td className="col3">
                  Posted by: <span className="blue-txt2">{p.user.user_name}</span><br /><br />
                  Tag: <span className="blue-txt2">{p.tag}</span>
                </td>

                <td className="col4">
                  <div className="btn-group">
                    {/* Edit & Delete buttons appear if the Post belongs to the User */}
                    {p.user_id === user_id 
                     ? <Link to ={mode === "user" 
                                  ? `/editpost/user/${p.id}` 
                                  : mode === "tag" 
                                  ? `/editpost/tag/${p.id}` 
                                  : `/editpost/all/${p.id}`} 
                             className="btn btn-sm btn-outline-success">Edit ✍
                       </Link> 
                     : <></>}

                    {p.user_id === user_id 
                     ? <a className="btn btn-sm btn-outline-success" onClick={() => del(p.id)} >Delete ✖</a> 
                     : <></>}

                    <button className={isLikedByUser(p.id) 
                      ? "btn btn-sm btn-outline-danger shaded_like" 
                      : "btn btn-sm btn-outline-danger"}
                            disabled={disabled} 
                            onClick={() => like(p.id)}>Like❤️
                    </button>

                    <a className="btn btn-sm btn-outline-danger" onClick={() => get_comment_view(p.id)}>Comment💬</a>

                  </div>
                  {/* the like count position varies for your post / other posts */}
                  {p.user_id === user_id 
                   ? <span id="likes_display_self">{ p.likes-1 }</span> 
                   : <span id="likes_display_others">{ p.likes-1 }</span>}
                  {/* comment over flow fature */}
                  <div className="overflow-hidden" style={ comment_toggle === p.id ? show : hide}> 
                    
                    <div className="littleverticalgap"></div>
                    <form className="ignore_css" onSubmit={post_comment}>
                      <input type="text" className="form-control2" 
                             placeholder="Enter your comment here." required
                             onChange={e=>setComment(e.target.value)} /> 
                      
                      <div className="littleverticalgap"></div>
                      <button className="w-100 btn btn-sm btn-primary" type="submit">Comment</button>
                    </form>

                    <div className="littleverticalgap"></div>
                    <div className="littleverticalgap"></div>
                  </div>

                  <p className="timestamp"><span className="orangetxt"><b>Posted at: </b></span>{p.created_at}</p>
                </td>

                <td className="col5"><a className="btn btn-sm btn-outline-secondary" onClick={() => get_view(p.id)} >View Comments</a>
                
                <div className="littleverticalgap"></div>
                <a className="btn btn-sm btn-outline-success" href={`/post/${mode}/${p.id}`} >Go to Post</a>                
                </td>  
              </tr>
              <tr>
                {/* comment view - hidden at first */}
                <td colSpan={5}>
                    <div className="overflow-hidden scrollablespace" 
                         style={ view === p.id ? show : hide}> {/* toggle fature for comment view*/}
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                            {p.comments.map((c: Comment) => {
                              return (
                                  <tr className="comment" key={c.id}>
                                    
                                      <td>{c.user.user_name}</td>
                                      <td className="col2comment">
                                          <div dangerouslySetInnerHTML={{__html: markDown.render(expandC ? c.content : c.content.slice(0, 150))}} />
                                          <span className="bluetxt" onClick={toggle_expandC}> {/* comment overflow expand feature */}
                                            {c.content.length > 150 ? (expand ? "show less" : "...see more") : ""}
                                          </span>
                                      </td>
                                      <td className="col3">
                                        {c.user.id === user_id 
                                        ? <Link to ={mode === "user" 
                                                     ? `/editcomment/userposts/${c.id}` 
                                                     : mode === "tag" 
                                                     ? `/editcomment/tagposts/${c.id}` 
                                                     : `/editcomment/allposts/${c.id}`}
                                                className="btn btn-sm btn-outline-info">Edit ✍
                                          </Link> 
                                        : <></>}

                                        {c.user_id === user_id 
                                         ? <a className="btn btn-sm btn-outline-info" 
                                              onClick={() => delC(c.id)} >Delete ✖
                                           </a> 
                                         : <></>}
                                      </td>
                                  </tr>
                              )
                            })}
                            </tbody>
                        </table>
                    </div>
                </td>
              </tr>
            </> 
            )
          })}
          </tbody>
        </table>
      </div>
  </Structure>
  ); 
}

export default UserPosts;  

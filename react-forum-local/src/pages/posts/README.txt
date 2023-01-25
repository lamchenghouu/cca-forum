This README is important if you are trying to understand the Post Display system, which is quite abstract.

I will be referring to the main URL section as localhost:<port> so if you are working with the deployed version, replace it with the appropriate main URL section. 

----------

While creating the Post views (PostDisplay.tsx) for the webapp, I realised that Post Displays for ALL POSTS / User's POSTS / tag:<tag> POSTS can all be modularised / generalised. 

Thus, I utilised tenary statements (learned from CS1101S) and abstraction to compress all 3 views into one single view.

PostDisplay React Hook (in PostDisplay.tsx) can be accessed using the following URL format: localhost:<port>/<mode>/<id>/<viewParam>
<viewParam> indicates the id of the comment section which is toggled open. (if any) (toggled means the 'View Comments' button is triggered for a post)

<viewParam> will only have a value other than 0 when being accessed from say a 'Go Back to Posts' button. For example, if you access ALL posts using localhost:3001/posts/all/0/0, and you open the comment section where the post has id=40. Then, you click on the 'Go to Post' button to enter the individual post page. Thereafter, you click 'Go Back to Posts'. This will redirect you to same ALL posts display page, along with comment section (post id=40) being opened. (this is a feature)

Similarly, if you were to access localhost:3001/posts/user/4/40 and then access any inidivudal post page, pressing the 'Go back to Posts' button will bring you back to User(user id=4)'s post page, with Comment(post id=40) section opened. 

We come to the 3 modes of PostDisplay.tsx - all, user, tag
Above, we mentioned soemthing similar to accessng localhost:3001/posts/user/4/0, this will bring you to the User(user id=4)'s post page with no comments section open (because <viewParam>=0).

Similarly, accessing localhost:3001/posts/tag/badminton/2 will bring you to Posts with tag:badminton, with comment section (post id=2) opened. 

----------

There is also IndivPost.tsx which displays the individual post page of any post. (we mentioned individual post pages above) The URL is localhost:<port>/post/:mode/:id (here)

Indiviual Post Pages have a 'Go back to Post' button, these buttons are linked to different variations of PostDisplay (localhost:<port>/<mode>/<id>/<viewParam>) pages, according to the :mode/:id that was passed in (here). 

----------

Similarly, edit post and edit comment routes have URL routes ending with /:mode/:id, for the purpose of keeping track what display mode the viewer is in. The id in this case is the post_id for EditPost, and comment_id for EditComment. With how the models are structured, each Post object has its tag/user data, and each Comment has its post/user data. As such, most information can be accessed. 

This information allows us to route back appropriately after accessing EditComment / EditPost.tsx rendered pages. 

E.g. We render PostDisplay.tsx via localhost:3001/posts/tag/badminton/0, then we see our post on teamNUS' recruitment (post id=39). We click on it to go to its indiviual post page (localhost:3001/post/tag/39 ). If we Go Back To Post (GBTP) now, we will return to tag:badminton PostDisplay. However, we choose to edit the post (localhost:3001/editpost/indiv/39). If we GBTP now, we will indeed return to the indiv page, because we had accessed EditPost in :mode=indiv. 

Alas! We have actually lost track of the initial :mode=tag. Sadly, the project does not support memory of previous 2 unidirectional routes as of now. Coming soon... 

Please don't hestitate to contact me for explanation of this system. I found it very fun to program :)
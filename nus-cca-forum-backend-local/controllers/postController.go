package controllers

import (
	"math"
	"strconv"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
)

/* UpdateProfile
INPUTS: JSON body input: "content"

PROCESS FLOW: Extract current logged-in user's id via JWT => Query current User => Initialise the new Post object => Parse JSON input into the Post object => Length check on tag => Create 

INVOKED BY: Button on React */
func CreateNewPost(c *fiber.Ctx) error {

	extractCookie := c.Cookies("jwt")
	id :=  AuthParseJWT(extractCookie);  

	var currUser models.User
	database.DB.Where("id", id).First(&currUser)

	newPost := models.Post {
		CreatedAt: time.Now().Format("02-Jan-06 3:04 PM"), // 02 is ref day, Jan is 01, 06 is year, 3:4 - hours, minutes
		Likes: 1,
	}

	if err := c.BodyParser(&newPost); err != nil {
		return err 
	}

	if (len(newPost.Tag) > 15) {
		return c.JSON(fiber.Map{
			"response": "Please enter a tag of length not exceeding 15.",
		})
	}

	newPost.UserId = currUser.Id 

	database.DB.Preload("User").Create(&newPost) 

	return c.JSON(fiber.Map{
		"response": "Post Created.",
	})
} 

/* GetPostByPostId: used for individual post
INPUTS: postid Param

PROCESS FLOW: Extract postid from Paramas => query the Post => return it in JSON ver

INVOKED BY: clicking on the content of each post in PostDisplay.tsx*/
func GetPostByPostId(c *fiber.Ctx) error {

	id, _ := strconv.Atoi(c.Params("postid"))

	currPost := models.Post {
		Id: uint(id), 
	}

	// Preloading all data that will be displayed on frontend
	database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Find(&currPost)

	return c.JSON(currPost)
} 

/* GetPostByPostId: used for individual post
INPUTS: JSON body input: "content", postid Param 

PROCESS FLOW: Extract logged in user id from JWT => Query User based on this id => Get postId from param => Query post to check whether Poster of the post is the current logged in user => Parse JSON into the object => Update */
func UpdatePost(c *fiber.Ctx) error {
	
	// Extract logged in user id from JWT // 
	extractCookie := c.Cookies("jwt")
	id :=  AuthParseJWT(extractCookie);  

	// Query User based on this id // 
	var currUser models.User
	database.DB.Where("id", id).First(&currUser)

	userId := currUser.Id // get it in the correct type, can be replaced with a typecast 
	postId, _ := strconv.Atoi(c.Params("postid"))

	// Retrieve current post to compare it's poster Id with logged in id (id) // 
	currPost := models.Post {
		Id: uint(postId), 
	}		
	database.DB.Find(&currPost)
	
	if currPost.UserId != userId {
		return c.JSON(fiber.Map{
			"response": "This is not your post!",
		})
	}
	// Parse JSON into the object //
	if err := c.BodyParser(&currPost); err != nil {
		return err 
	}

	database.DB.Model(&currPost).Updates(currPost) // Update

	return c.JSON(currPost)
}

/* GetPostByPostId: used for individual post
INPUTS: postid Param 

PROCESS FLOW: Extract logged in user id from JWT => Query User based on this id => Get postId from param => Query post to check whether Poster of the post is the current logged in user => Delete

INVOKED BY: clicking delete button on a post, which will only be shown to authorised users (VERIFICATION here is just to prevent unauthorised users from accessing via URL) */
func DeletePost(c *fiber.Ctx) error {

	extractCookie := c.Cookies("jwt")
	id :=  AuthParseJWT(extractCookie);  


	var currUser models.User
	database.DB.Where("id", id).First(&currUser)

	userId := currUser.Id
	postId, _ := strconv.Atoi(c.Params("postid"))

	currPost := models.Post{
		Id: uint(postId), 
	}

	database.DB.Find(&currPost)

	if currPost.UserId != userId {
		return c.JSON(fiber.Map{
			"response": "This is not your post!",
		})
	}

	database.DB.Delete(&currPost)

	return nil
}

/* GetAllPosts: 
INPUTS: sort Param

PROCESS FLOW: Get sort preference from URL => Pagination => Query with sort => Return data

INVOKED BY: PostDisplay.tsx */
func GetAllPosts(c *fiber.Ctx) error { 

	//// GET SORT PREFERENCE ////
	sort := c.Query("sort")

	page, _ := strconv.Atoi(c.Query("page", "1")) // default value 
	// e.g. localhost:3000/user/1/allposts/page?=1	

	//// SEPARATE RECORDS INTO PAGES ////
	var totalR int64;  
	database.DB.Model(&models.Post{}).Count(&totalR)

	rPerPage := 10 // Records per page 
	offset := (page - 1) * rPerPage // Offset based on page selected 

	var posts []models.Post

	/// QUERY WITH SORT and OFFSET //
	if (sort == "d") { // d for date descending
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("id desc").Offset(offset).Limit(rPerPage).Find(&posts) 
	} else { // l for likes descending 
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("likes desc").Offset(offset).Limit(rPerPage).Find(&posts)
	}
	
	return c.JSON(fiber.Map{
		"data": posts, 
		"page_details": fiber.Map {
			"total": totalR, 
			"page": page,
			"last_page": int(math.Ceil(float64(totalR)/float64(rPerPage))),
		},
	})
}

// Gets the post with most likes
func GetTopPost(c *fiber.Ctx) error {
	var topPost models.Post; 
	database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("likes desc").Limit(1).Find(&topPost)
	return c.JSON(topPost)
}
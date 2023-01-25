package controllers

import (
	"math"
	"strconv"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
)

/* GetAllPostsByUserID: GetAllPosts by only for the User specified
INPUTS: Params: sort ('l' for likes descending, 'd' for date descending), userid 

PROCESS FLOW: Get sort preference and user ID from URL => Pagination => Query with sort => Return data

INVOKED BY: PostDisplay.tsx */
func GetAllPostsByUserID(c *fiber.Ctx) error { // each post has user data 
	
	//// GET SORT PREFERENCE ////
	sort := c.Query("sort")

	//// EXTRACT USER ID FROM URL ////
	id, _ := strconv.Atoi(c.Params("userid"))
	
	page, _ := strconv.Atoi(c.Query("page", "1")) // default value 
	// e.g. localhost:3000/user/1/allposts/page?=1	

	//// SEPARATE RECORDS INTO PAGES ////
	var totalR int64;  
	database.DB.Model(&models.Post{}).Where("user_id", id).Count(&totalR)

	rPerPage := 10 
	offset := (page - 1) * rPerPage

	var posts []models.Post
	if (sort == "d") {
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("id desc").Offset(offset).Limit(rPerPage).Where("user_id", id).Find(&posts) // very impt, preload nested models // total r-  offset to reverse (use this along with reverse in react)
	} else { // sort == "l" 
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("likes desc").Offset(offset).Limit(rPerPage).Where("user_id", id).Find(&posts)
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

/* GetPostsByTag: GetAllPosts by only for the tag specified
INPUTS: Params: sort ('l' for likes descending, 'd' for date descending), tag 

PROCESS FLOW: Get sort preference and tag from URL => Pagination => Query with sort => Return data

INVOKED BY: PostDisplay.tsx */
func GetPostsByTag(c *fiber.Ctx) error {
	//// GET SORT PREFERENCE ////
	sort := c.Query("sort")

	//// GET TAG ////
	tag := c.Params("tag") 
	page, _ := strconv.Atoi(c.Query("page", "1"))

	//// SEPARATE RECORDS INTO PAGES ////
	var totalR int64;  
	database.DB.Model(&models.Post{}).Where("tag", tag).Count(&totalR)

	rPerPage := 10 
	offset := (page - 1) * rPerPage

	//// CREATE NEW OBJECT //// 
	var posts []models.Post

	//// PASS QUERY INTO OBJECT /// 
	if (sort == "d") {
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("id desc").Offset(offset).Limit(rPerPage).Where("tag", tag).Find(&posts)
	} else {
		database.DB.Preload("User").Preload("Comments").Preload("Comments.User").Order("likes desc").Offset(offset).Limit(rPerPage).Where("tag", tag).Find(&posts)	
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

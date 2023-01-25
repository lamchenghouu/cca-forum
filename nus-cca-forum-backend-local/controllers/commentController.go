package controllers

import (
	"strconv"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
)

// General notes
// - Data is preloaded in the GORM request as and when needed
// - Try to minimise the amount of preloading 
// - For some methods, the user_id is extracted from JWT, to ensure 
//   that the user has permissiosn to e.g. update a certain comment

/* CreateNewComment
INPUTS: JSON body input: "content"; postId from Params; userId from JWT

OUTPUT: JSON containing new_comment (not used in React, but useful for testing via POSTMAN)

NOTES: no need for extra AUTH, every user can comment on every post */

func CreateNewComment(c *fiber.Ctx) error {
	//// GET postId from Params and query the Post with postId //// 
	postId, _ := strconv.Atoi(c.Params("postid"))

	//// GET userId //// 
	extractCookie := c.Cookies("jwt")
	userId, _ :=  strconv.Atoi(AuthParseJWT(extractCookie)); 

	//// RETRIEVE JSON body input //// 
	var newComment models.Comment 
	if err := c.BodyParser(&newComment); err != nil {
		return err 
	}

	newComment.PostId = uint(postId) // Important due to typing
	newComment.UserId = uint(userId) // IDs are set as uint in this app 

	database.DB.Create(&newComment) //// CREATE comment //// 

	return c.JSON(newComment)
} 

/* GetCommentById (used for placeholder when editing comments)
INPUTS: commentId from Params

OUTPUT: JSON containing requested comment */

func GetCommentById(c *fiber.Ctx) error {

	commentId, _ := strconv.Atoi(c.Params("commentid"))

	currComment := models.Comment {
		Id: uint(commentId), 
	}

	database.DB.Preload("Post").Preload("User").Find(&currComment)

	return c.JSON(currComment)
} 


/* UpdateComment
INPUTS: JSON body input: "content"; commentId from Params; userId from JWT 

OUTPUT: JSON containing updated comment */

func UpdateComment(c *fiber.Ctx) error {
	
	//// GET commentId //// 
	commentId, _ := strconv.Atoi(c.Params("commentid")) 

	//// GET userId ////
	extractCookie := c.Cookies("jwt")
	userId, _ :=  strconv.Atoi(AuthParseJWT(extractCookie));  

	//// GET comment with commentId ////
	currComment := models.Comment {
		Id: uint(commentId), 
	}	
	database.DB.Find(&currComment)
	
	//// Assign comment's poster's id to currCommentUserId //// 
	currCommentUserId := currComment.UserId 
	//// Validate that its the comment poster ////
	if int(currCommentUserId) != userId {
		return c.JSON(fiber.Map{
			"response": "This is not your comment!",
		})
	}
	
	//// RETRIEVE JSON body input //// 
	if err := c.BodyParser(&currComment); err != nil {
		return err 
	}

	database.DB.Model(&currComment).Updates(currComment) // UPDATE

	return c.JSON(currComment)
}

/* DeleteComment
INPUTS: comment_id from Params; user_id from JWT  */

func DeleteComment(c *fiber.Ctx) error {

	commentId, _ := strconv.Atoi(c.Params("commentid"))

	extractCookie := c.Cookies("jwt")
	userId, _ :=  strconv.Atoi(AuthParseJWT(extractCookie));  

	//// QUERY to-be-deleted comment //// 
	currComment := models.Comment {
		Id: uint(commentId), 
	}
	database.DB.Find(&currComment)
	
	//// Assign comment's poster's id to currCommentUserId //// 
	currCommentUserId := currComment.UserId
	//// Validate that its the comment poster ////
	if int(currCommentUserId) != userId {
		return c.JSON(fiber.Map{
			"response": "This is not your comment!",
		})
	}

	database.DB.Delete(&currComment) // DELETE

	return nil 
}
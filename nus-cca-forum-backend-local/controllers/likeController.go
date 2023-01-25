package controllers

import (
	"strconv"
	"strings"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
)

/**
 * LikePost will allow the user to like the post if not liked,
 * and unlikes the post if liked. Each like, the Likes attribute
 * of the post increments and the postId is added to the 'Likes'
 * string in the User object.
 *
 * The reason for using a string is so that I can discover string
 * processing. I have also discovered that it is easier to store
 * strings in SQL. However, I will explore more options after submission
 */

func LikePost(c *fiber.Ctx) error { // no need for access control 

	postId := c.Params("postid") // extract from URL 

	//// EXTRACT USER ID FROM JWT COOKIE //// 
	extractCookie := c.Cookies("jwt")
	cookieId :=  AuthParseJWT(extractCookie)  
	userId, _ := strconv.Atoi(cookieId) 

	//// QUERY CURRENT LOGGED IN USER ////
	var currUser models.User; 
	database.DB.Where("id", userId).First(&currUser) // to extract and update likes str 

	//// CHECK IF POST HAS BEEN LIKED //// 
	var liked bool = false; 
	var currLikesStr []string = strings.Fields(currUser.Likes); 
	for _, postIdX := range currLikesStr {
		if postIdX == postId {
			liked = true 
		} 
	}

	//// CREATE NEW MODIFIED LIKE STRING ////
	var newLikesStr string; // replacement likes string 
	
	if (liked) {
		for _, postIdX := range currLikesStr {
			if postIdX != postId {
				if newLikesStr == "" {
					newLikesStr = postIdX
				} else {
					newLikesStr += " " + postIdX 
				}
			}
		}
	} else { // not liked, thus we like 
		if strings.Compare(currUser.Likes, "NONE") == 0 { // exact match
			newLikesStr = postId + " "
		} else {
			newLikesStr = currUser.Likes + postId + " "
		}
	}

	// The reason why we don't use empty string is because we will run into an error comparing an empty string using strings.Compare 
	if newLikesStr == "" {
		newLikesStr = "NONE" 
	}
	
	//// UPDATE USER //// 
	currUser = models.User {
		Id: uint(userId), 
		Likes: newLikesStr,
	}
	database.DB.Model(&currUser).Updates(currUser)
	
	//// QUERY POST //// 
	var currPost models.Post; 
	database.DB.Where("id", postId).First(&currPost)

	//// UPDATE POST //// 
	postIdInt, _ := strconv.Atoi(postId)
	var newLikes int; 
	if (liked) {
		newLikes = currPost.Likes - 1 
	} else {
		newLikes = currPost.Likes + 1 
	}
	
	updatePost := models.Post{
		Id: uint(postIdInt),
		Likes: newLikes, 
	}

	database.DB.Model(&updatePost).Updates(&updatePost)
	
	return c.JSON(fiber.Map{
		"response": "Successfully liked the post.",
	})
} 


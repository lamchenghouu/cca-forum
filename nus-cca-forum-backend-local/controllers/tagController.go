package controllers 

import (
	"strconv"
	"sort"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
)

/**
 * GetPopularTags returns a JSON containing a slice / array of the tags in descending popularity 
 * Axios will access the route which invokes this function. 
 * React will display the contents accordingly. 
 * @params: arr will be the 2D slice where each nested []string stores {<tag>, <likes>}; tag will be the tag we want to potentially push into the array; likes is the number of likes associated with the post
 */
 
func PushToArray (arr [][]string, tag string, likes int) [][]string {
	var isIn bool = false // to keep track if the tag exists 
	for _, nestedArray := range arr {
		if (nestedArray[0] == tag) {
			isIn = true; 
			currLikes, _ := strconv.Atoi(nestedArray[1]) 
			currLikes += likes; 
			nestedArray[1] = strconv.Itoa(currLikes) // typecasting for incrementing accumulative likes
			break; 
		}
	}
	if (!isIn) { // if tag does not exist, append nested array for tag 
		newEntry := []string{tag, strconv.Itoa(likes)}; 
		arr = append(arr, newEntry);  
	} 
	return arr 
}


/**
 * GetPopularTags returns a JSON containing a slice / array of the tags in descending popularity 
 * Axios will access the route which invokes this function. 
 * React will display the contents accordingly. 
 */

func GetPopularTags(c *fiber.Ctx) error {
	//// DECLARE return slice ////
	var tags [][]string; // Each nested array stores {<tag>, <cumulativeLikes>}

	//// QUERY data from MySQL ////
	var posts []models.Post
  	database.DB.Find(&posts)

	//// INVOKE PushToArray method //// 
	for _, post := range posts {
		tags = PushToArray(tags, post.Tag, post.Likes)
	}

	//// SORT tags based on number of likes; import "sort" ////
	
	sort.Slice(tags, func(i int, j int) bool {
		lhs, _ := strconv.Atoi(tags[i][1]) 
		rhs, _ := strconv.Atoi(tags[j][1]) 
		return lhs > rhs // sorts based on the 2nd column
	}) 
	
	return c.JSON(fiber.Map{
		"data": tags, 
	})

}
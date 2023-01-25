package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/controllers"
)

// Authentication middleware, which you .Use before the routes you want to restrict. This function extracts the current logged-in User to determine if there is a user logged in. If so, it will return c.Next(), allowing routes below the .Use() to be accessed 

func AccessControl(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	if controllers.AuthParseJWT(cookie) == "" {
		return c.JSON(fiber.Map {
			"response": "You are not allowed to access this page.",
		})
	}
	return c.Next() // goes to the next route of the Ctx (Context)
}
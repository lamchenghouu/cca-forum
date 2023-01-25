package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/routes"
)

func main() {
	database.ConnectToDB() // connects to DB, code in database.go 

	app := fiber.New()

	app.Use(cors.New(cors.Config{
        AllowCredentials: true,
    }))
	///// This ensures frontend get the cookies. ///// 
	// CORS stands for Cross-Origin Resource Sharing
	// From stackoverflow: CORS deos not include cookies on cross-origin requests. To reduce vulnerabilities, CORS requires both server and client to include cookies on requests. 
	// The following code enables that, and is required to pass around the JWT token
		
	routes.Setup(app) // app here passed in will be an address 

	app.Listen(":3004")
}
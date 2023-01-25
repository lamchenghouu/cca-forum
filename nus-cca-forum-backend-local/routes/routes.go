package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/controllers"
	//"github.com/lamchenghouu/cca_forum/middlewares"
)

func Setup(app *fiber.App) { 
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/forgetpassword", controllers.ForgetPassword)
	app.Post("/api/checksecurityans", controllers.CheckSecurityAns)
	app.Post("/api/resetpassword", controllers.ResetPassword)
	app.Get("/api/toppost", controllers.GetTopPost) // for the homepage display
	app.Get("/api/populartags", controllers.GetPopularTags)
	
	app.Use(AccessControl) // MIDDLEWARE

	app.Get("/api/user", controllers.Profile)
	app.Post("/api/logout", controllers.Logout)
	app.Put("/api/updateprofile", controllers.UpdateProfile)

	app.Post("/api/user/createpost", controllers.CreateNewPost)
	app.Get("/api/post/:postid", controllers.GetPostByPostId)
	app.Put("/api/post/:postid", controllers.UpdatePost)
	app.Delete("/api/post/:postid", controllers.DeletePost)
	app.Get("/api/posts", controllers.GetAllPosts)
	
	app.Post("/api/user/post/:postid/createcomment", controllers.CreateNewComment)
	app.Get("/api/posts/comments/:commentid", controllers.GetCommentById)
	app.Put("/api/posts/comments/:commentid", controllers.UpdateComment)
	app.Delete("/api/posts/comments/:commentid", controllers.DeleteComment)

	app.Get("/api/user/:userid/allposts", controllers.GetAllPostsByUserID)
	app.Get("/api/post/tag/:tag", controllers.GetPostsByTag)

	app.Post("/api/post/:postid/like", controllers.LikePost)
} 

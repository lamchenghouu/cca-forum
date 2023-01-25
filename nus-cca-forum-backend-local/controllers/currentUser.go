package controllers

import (
	"strconv"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/lamchenghouu/cca_forum/database"
	"github.com/lamchenghouu/cca_forum/models"
	"golang.org/x/crypto/bcrypt"
)


// General notes
// - Thought about importing "errors", but will do so in upcoming projects.
//   Usage: c.Status(fiber.StatusUnauthorized); return errors.New("unauthorized"); 
// App already has decent access control, errors will provide more


/* Register
INPUTS: JSON body input: "user_name", "password", "confirm_password", "security_qns", "security_ans"

PROCESS FLOW: Parse the JSON input => Check if User exists => Range check => Password match check => Length check => Hashing of password & security answer => Creation

OUTPUT: JSON success response msg 

INVOKED BY: Button press in React */
func Register(c *fiber.Ctx) error {

	// Parse the JSON input // 
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err 
	}

	// Check if User exists // 
	var userCount int64
	database.DB.Model(&models.User{}).Where("user_name = ?", data["user_name"]).Count(&userCount)
	if (userCount > 0) {
		return c.JSON(fiber.Map{
			"response": "User already exists.",
		})
	} 

	// DATA VALIDATION: Range check => Password match check => Length check //
	if (len(data["user_name"]) < 4 || len(data["user_name"]) > 20) {
		return c.JSON(fiber.Map{
			"response": "Please enter a username of length 4-20.",
		})
	} 

	password := data["password"]
	securityAns := data["security_ans"]

	if password != data["confirm_password"] { 
		return c.JSON(fiber.Map{
			"response": "Please re-enter, passwords do not match.",
		})
	}
	
	if (len(password) < 8 || len(password) > 20) {
		return c.JSON(fiber.Map{
			"response": "Please enter a password of length 8-20.",
		})
	} 

	if (len(securityAns) < 8 || len(securityAns) > 20) {
		return c.JSON(fiber.Map{
			"response": "Please enter a security answer of length 8-20.",
		})
	} 

	user := models.User {
		UserName: data["user_name"],
		SecurityQns: data["security_qns"],
		Likes: "NONE",
	}

	/* https://pkg.go.dev/golang.org/x/crypto/bcrypt (DOCS)
	func GenerateFromPassword(password []byte, cost int) ([]byte, error) */ 

	// Hashing // 
	bcryptHash, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	user.Password = bcryptHash
	
	bcryptHash2, _ := bcrypt.GenerateFromPassword([]byte(data["security_ans"]), 14)
	user.SecurityAns = bcryptHash2 

	database.DB.Create(&user)
	return c.JSON(fiber.Map{
		"response": "Registration completed.",
	})
}

/* Login
INPUTS: JSON body input: "user_name", "password"

PROCESS FLOW: Parse the JSON input => Attempt to extract user => If user exists, extractUser.Id will be >0. Thus, if extractUser.Id == 0, it means that the user does not exist and we return the appropriate response. 
=> Create JWT (external function in jwtGen.go) => Store JWT as cookie (via fiber framework)

OUTPUT: JSON success response msg 

INVOKED BY: Button press in React */
func Login(c *fiber.Ctx) error {

	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err 
	}

	var extractUser models.User 

	database.DB.Where("user_name", data["user_name"]).First(&extractUser)

	// user.Id = 0 indicates that user record does not exist as SQL Iota Id starts from 1 
	if extractUser.Id == 0 { 
		return c.JSON(fiber.Map {
			"response": "User does not exist.", 
		})
	}

	//  Create JWT (external function in jwtGen.go) // 
	jwToken := AuthGenerateJWT(extractUser, data["password"])

	if (jwToken == "Incorrect Password.") {
		return c.JSON(fiber.Map {
			"response": jwToken, // "Incorrect Password."
		})
	}

	// Store JWT token in cookie (fiber) // 
	cookie := fiber.Cookie {
		Name: "jwt",
		Value: jwToken, 
		Expires: time.Now().Add(time.Hour * 24), // cookie expires in 24hr
		HTTPOnly: true,
	} 

	c.Cookie(&cookie)
	return c.JSON(fiber.Map{
		"response": "Login completed.", 
	})	
}

/* ForgetPassword
INPUTS: JSON body input: "user_name"

PROCESS FLOW: Parse the JSON input => Attempt to extract user => If OK, it returns the appropriate response along with user_name & security question 

OUTPUT: JSON success response msg, along with user_name & security question

INVOKED BY: Button press in React, it checks if username given exist, then uses the OUTPUT here to INVOKE CheckSecurityAns */
func ForgetPassword(c *fiber.Ctx) error {
	
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err 
	}

	var extractUser models.User 
	database.DB.Where("user_name", data["user_name"]).First(&extractUser)

	if extractUser.Id == 0 { 
		return c.JSON(fiber.Map {
			"response": "User does not exist.", 
		})
	}

	return c.JSON(fiber.Map{ // data to be used in CheckSecurityAns
		"response": "Username exists.",
		"user_name": data["user_name"],
		"security_qns": extractUser.SecurityQns, 
	})
}

/* CheckSecurityAns
INPUTS: JSON body input: "security_ans", "user_name" 

PROCESS FLOW: Parse the JSON input => Extract the securityAnsAttempt and user_name => Query User object => Use VerifySecurityAns from jwtGen.go to verify the security answer. 
NOTE: VerifySecurityAns compares securityAnsAttempt with the hashed SecurityAns in the User object in question

OUTPUT: JSON success response msg

INVOKED BY: Aftereffect of ForgetPassword, controlled by React (frontend) */
func CheckSecurityAns(c *fiber.Ctx) error { 
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err 
	}

	securityAnsAttempt := data["security_ans"]
	
	var extractUser models.User 
	database.DB.Where("user_name", data["user_name"]).First(&extractUser)

	var verified bool = VerifySecurityAns(extractUser, securityAnsAttempt)

	if (!verified) {
		return c.JSON(fiber.Map{
			"response": "Security Answer Wrong.",
		})
	} else {
		return c.JSON(fiber.Map{
			"response": "OK.",
		}) 
	}

}

/* ResetPassword
INPUTS: JSON body input: "new_password" 

PROCESS FLOW: Parse the JSON input => Query User object as extractUser => Extract new password from JSON input => Length check => Hash password => Update user

OUTPUT: JSON success response msg

INVOKED BY: Aftereffect of ForgetPassword, controlled by React (frontend) */
func ResetPassword(c *fiber.Ctx) error {
	
	// Parse the JSON input // 
	var data map[string]string 
	if err := c.BodyParser(&data); err != nil {
		return err 
	}

	// Query User object as extractUser // 
	var extractUser models.User 
	database.DB.Where("user_name", data["user_name"]).First(&extractUser)

	newPw := data["new_password"];  // Extract new password from JSON input

	if (len(newPw) < 8 || len(newPw) > 20) { // Length check
		return c.JSON(fiber.Map{
			"response": "Please enter a password of length 8-20.",
		})
	} 

	// Hash password // 
	bcryptHash, _ := bcrypt.GenerateFromPassword([]byte(newPw), 14)
	
	// Update user // 
	user := models.User {
		Id: extractUser.Id,
		Password: bcryptHash,
	}	
	database.DB.Model(&user).Updates(&user) 
	
	return c.JSON(fiber.Map{
		"response": "Password Updated Successfully.",
	})
}

/* Logout
Uses fiber context Cookie method to set cookie to expire in the past. Returns "logged out" as a response in the TS object. */
func Logout(c *fiber.Ctx) error {
	///// LOGOUT BY REMOVING COOKIE /////
	cookie := fiber.Cookie {
		Name: "jwt",
		Value: "", 
		Expires: time.Now().Add(-time.Minute), // doesn't need Unix time uses default; setting expiration to the past will make the cookie expire; the cookie will become moldy. 
		HTTPOnly: true,
	} 

	c.Cookie(&cookie)
	return c.JSON(fiber.Map {
		"response": "Logged out.", 
	})
}

/* UpdateProfile
INPUTS: JSON body input: "user_name", "seucrity_qns", "security_ans" 

PROCESS FLOW: Extract current logged-in user's id via JWT => Parse JSON Input => Hash security answer if there's any input => Update

INVOKED BY: Button on React */
func UpdateProfile(c *fiber.Ctx) error {

	extractCookie := c.Cookies("jwt")
	idd :=  AuthParseJWT(extractCookie);  

	id, _ := strconv.Atoi(idd)

	var data map[string]string
	
	if err := c.BodyParser(&data); err != nil {
		return err 
	}
	
	currUser := models.User {
		Id: uint(id), 
		UserName: data["user_name"],
		SecurityQns: data["security_qns"],
	}

	if (data["security_ans"] != "") {
		bcryptHash, _ := bcrypt.GenerateFromPassword([]byte(data["security_ans"]), 14)
		currUser.SecurityAns = bcryptHash 
	}

	database.DB.Model(&currUser).Updates(currUser) 
	
	return c.JSON(fiber.Map{
		"response": "Profile Updated.", 
	})
}

/* UpdateProfile
PROCESS FLOW: Extract current logged-in user's id via JWT => Query User via GORM and Query Post Count => Return both User and Post Count'

INVOKED BY: Button on React */
func Profile(c *fiber.Ctx) error {
	extractCookie := c.Cookies("jwt")
	id :=  AuthParseJWT(extractCookie);  

	var userQuery models.User
	database.DB.Where("id", id).First(&userQuery)

	var noPosts int64; 
	database.DB.Model(&models.Post{}).Where("user_id = ?", id).Count(&noPosts)

	return c.JSON(fiber.Map{
		"data": userQuery, 
		"no_posts": strconv.Itoa(int(noPosts)), 
	})
}

	

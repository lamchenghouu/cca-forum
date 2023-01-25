package controllers

import (
	"strconv"
	"time"
	"github.com/lamchenghouu/cca_forum/models"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

// Since we require all the JWT + bcrypt code for multiple uses, we should make it more abstract and reusable

// We are using bcrypt and jwt-go by dgrijalva. 
// https://pkg.go.dev/golang.org/x/crypto/bcrypt 
// https://pkg.go.dev/github.com/dgrijalva/jwt-go#section-readme
// CompareHashAndPassword returns nil on success and err otherwise 

/* VerifySecurityAns
This does not generate a JWT, it simply compares the hashed SecurityAns stored in the User instance to the securityAnsAttempt.
The implementation of CompareHashAndPassword is not mine and is imported.
*/
func VerifySecurityAns(extractUser models.User, securityAnsAttempt string) bool {
	if check := bcrypt.CompareHashAndPassword(extractUser.SecurityAns, []byte(securityAnsAttempt)); check != nil {
		return false 
	}	
	return true 
}

/* AuthGenerateJWT
This generates a JWT, it compares the hashed Password stored in the User instance to the password attempt.
*/
func AuthGenerateJWT(extractUser models.User, pwAttempt string) string {


	if check := bcrypt.CompareHashAndPassword(extractUser.Password, []byte(pwAttempt)); check != nil {
		return "Incorrect Password."
	}
	
	// Login successful, Generate JWT Token
	// Claims are information related to the JWT e.g. Issuer
	claims  := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Hour * 12).Unix(), // expires in 12hrs (converted to Unix time, as needed)
		Issuer: strconv.Itoa(int(extractUser.Id)),  // string
	})
	
	jwToken, _ := claims.SignedString([]byte("NUSCS"))

	return jwToken 
}

/* AuthParseJWT
This 'reverses' the process of AuthGenerateJWT. 
i.e. NewWithClaims is the opposite of ParseWithClaims
If the JWT token does not exist or is invalid, we return "" which will be detected by other functions with uses this function.
Otherwise, we return the claim that is the id of the User associated with the JWT. 
*/
func AuthParseJWT(extractCookie string) string {
	jwToken, err := jwt.ParseWithClaims(extractCookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("NUSCS"), nil
	})
	
	if err != nil || !jwToken.Valid {
		return "" 
	}

	claims := jwToken.Claims.(*jwt.StandardClaims)

	return claims.Issuer 
}
package database

import (
	"github.com/lamchenghouu/cca_forum/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB // gorm DB pointer

// Standard code to connect to MySQL database, all models must be migrated //
func ConnectToDB() {
	database, potentialError := gorm.Open(mysql.Open("root:sushi15theb3st_1!@/nus_cca_forum"), &gorm.Config{})

	if potentialError != nil {
		panic("Failed to connect to database.")
	}

	DB = database
	database.AutoMigrate(&models.Post{}, &models.Comment{}, &models.User{})
}
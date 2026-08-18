package database

import (
	"api/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func Connect() {
	database, err := gorm.Open(sqlite.Open("blog.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!")
	}

	err = database.AutoMigrate(&models.User{}, &models.Content{})
	if err != nil {
		log.Fatal("Failed to migrate database!")
	}

	DB = database
}

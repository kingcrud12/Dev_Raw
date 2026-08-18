package handlers

import (
	"api/database"
	"api/models"
	"net/http"

	"context"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetAllContent(c *gin.Context) {
	var contents []models.Content
	contentType := c.Query("type")

	query := database.DB.Model(&models.Content{})
	if contentType != "" {
		query = query.Where("type = ?", contentType)
	}

	if err := query.Find(&contents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch content"})
		return
	}

	c.JSON(http.StatusOK, contents)
}

func GetMyContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	var contents []models.Content
	
	if err := database.DB.Where("author_id = ?", userID).Find(&contents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch content"})
		return
	}

	c.JSON(http.StatusOK, contents)
}

func CreateContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	title := c.PostForm("title")
	contentType := c.PostForm("type")
	description := c.PostForm("description")
	tags := c.PostForm("tags")

	var imageUrl string

	file, _, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()
		cld, err := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"), os.Getenv("CLOUDINARY_API_KEY"), os.Getenv("CLOUDINARY_API_SECRET"))
		if err == nil {
			uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{Folder: "blog"})
			if err == nil {
				imageUrl = uploadResult.SecureURL
			}
		}
	}

	parsedUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	content := models.Content{
		Type:        models.ContentType(contentType),
		Title:       title,
		Description: description,
		Tags:        tags,
		ImageUrl:    imageUrl,
		AuthorID:    parsedUUID,
	}

	if err := database.DB.Create(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create content"})
		return
	}

	c.JSON(http.StatusCreated, content)
}

func UpdateContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	id := c.Param("id")

	var content models.Content
	if err := database.DB.Where("id = ? AND author_id = ?", id, userID).First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found or unauthorized"})
		return
	}

	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	content.Title = c.PostForm("title")
	content.Type = models.ContentType(c.PostForm("type"))
	content.Description = c.PostForm("description")
	content.Tags = c.PostForm("tags")

	file, _, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()
		cld, err := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"), os.Getenv("CLOUDINARY_API_KEY"), os.Getenv("CLOUDINARY_API_SECRET"))
		if err == nil {
			uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{Folder: "blog"})
			if err == nil {
				content.ImageUrl = uploadResult.SecureURL
			}
		}
	}

	database.DB.Save(&content)
	c.JSON(http.StatusOK, content)
}

func DeleteContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	id := c.Param("id")

	var content models.Content
	if err := database.DB.Where("id = ? AND author_id = ?", id, userID).First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found or unauthorized"})
		return
	}

	database.DB.Delete(&content)
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}

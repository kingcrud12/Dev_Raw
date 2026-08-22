package handlers

import (
	"api/database"
	"api/models"
	"net/http"

	"context"
	"html"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func generateSlug(title string) string {
	slug := strings.ToLower(title)
	reg := regexp.MustCompile("[^a-z0-9]+")
	slug = reg.ReplaceAllString(slug, "-")
	return strings.Trim(slug, "-")
}

func GetAllContent(c *gin.Context) {
	var contents []models.Content
	contentType := c.Query("type")

	query := database.DB.Model(&models.Content{})
	if contentType != "" {
		query = query.Where("type = ?", contentType)
	}

	if err := query.Order("order_position ASC, created_at DESC").Find(&contents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch content"})
		return
	}

	c.JSON(http.StatusOK, contents)
}

func GetMyContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	userRole, _ := c.Get("userRole")
	var contents []models.Content
	
	query := database.DB.Model(&models.Content{})
	if userRole != string(models.RoleAdmin) {
		query = query.Where("author_id = ?", userID)
	}

	if err := query.Order("order_position ASC, created_at DESC").Find(&contents).Error; err != nil {
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
	titleEn := c.PostForm("titleEn")
	contentType := c.PostForm("type")
	description := c.PostForm("description")
	descriptionEn := c.PostForm("descriptionEn")
	tags := c.PostForm("tags")
	contentText := c.PostForm("contentText")
	contentTextEn := c.PostForm("contentTextEn")
	readingTime, _ := strconv.Atoi(c.PostForm("readingTime"))
	if readingTime <= 0 {
		readingTime = 5 // default
	}

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
		Type:          models.ContentType(contentType),
		Slug:          generateSlug(title) + "-" + parsedUUID.String()[:6],
		Title:         title,
		TitleEn:       titleEn,
		Description:   description,
		DescriptionEn: descriptionEn,
		ContentText:   contentText,
		ContentTextEn: contentTextEn,
		Tags:          tags,
		ImageUrl:      imageUrl,
		AuthorID:      parsedUUID,
		ReadingTime:   readingTime,
	}

	if err := database.DB.Create(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create content"})
		return
	}

	c.JSON(http.StatusCreated, content)
}

func UpdateContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	userRole, _ := c.Get("userRole")
	id := c.Param("id")

	var content models.Content
	query := database.DB.Where("id = ?", id)
	if userRole != string(models.RoleAdmin) {
		query = query.Where("author_id = ?", userID)
	}
	if err := query.First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found or unauthorized"})
		return
	}

	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	content.Title = c.PostForm("title")
	content.TitleEn = c.PostForm("titleEn")
	content.Slug = generateSlug(content.Title) + "-" + content.AuthorID.String()[:6]
	content.Type = models.ContentType(c.PostForm("type"))
	content.Description = c.PostForm("description")
	content.DescriptionEn = c.PostForm("descriptionEn")
	content.ContentText = c.PostForm("contentText")
	content.ContentTextEn = c.PostForm("contentTextEn")
	content.Tags = c.PostForm("tags")
	
	rt, err := strconv.Atoi(c.PostForm("readingTime"))
	if err == nil && rt > 0 {
		content.ReadingTime = rt
	}

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

	if err := database.DB.Save(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save content to database", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, content)
}

func DeleteContent(c *gin.Context) {
	userID, _ := c.Get("userID")
	userRole, _ := c.Get("userRole")
	id := c.Param("id")

	var content models.Content
	query := database.DB.Where("id = ?", id)
	if userRole != string(models.RoleAdmin) {
		query = query.Where("author_id = ?", userID)
	}
	if err := query.First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found or unauthorized"})
		return
	}

	database.DB.Delete(&content)
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}

func SearchContent(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusOK, []models.Content{})
		return
	}

	// Sanitize to prevent XSS if the string is reflected or injected anywhere unescaped
	// GORM parameterized queries inherently protect against SQL injections
	safeQuery := html.EscapeString(q)
	searchPattern := "%" + safeQuery + "%"

	var contents []models.Content
	err := database.DB.Where(
		"title LIKE ? OR description LIKE ? OR tags LIKE ?",
		searchPattern, searchPattern, searchPattern,
	).Find(&contents).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search content"})
		return
	}

	c.JSON(http.StatusOK, contents)
}

func GetContentBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var content models.Content
	
	if err := database.DB.Where("slug = ?", slug).First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
		return
	}
	
	c.JSON(http.StatusOK, content)
}

func ReorderContents(c *gin.Context) {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	for i, id := range body.IDs {
		database.DB.Model(&models.Content{}).Where("id = ?", id).Update("order_position", i)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reordered successfully"})
}

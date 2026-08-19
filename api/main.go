package main

import (
	"api/database"
	"api/handlers"
	"api/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
	"strings"
)

func main() {
	godotenv.Load()
	if secret := os.Getenv("jwt_key"); secret != "" {
		middleware.JwtKey = []byte(secret)
	} else {
		middleware.JwtKey = []byte("default_fallback_secret") // Fallback just in case
	}

	database.Connect()

	r := gin.Default()

	// CORS Middleware (Dynamic Multi-Origin)
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		
		allowedOrigins := []string{
			"http://localhost:5173",
			"http://localhost:5174",
		}

		// Support multiple origins from FRONTEND_URL (comma separated)
		if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
			allowedOrigins = append(allowedOrigins, strings.Split(frontendURL, ",")...)
		}

		// Support ALLOWED_ORIGINS
		if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
			allowedOrigins = append(allowedOrigins, strings.Split(envOrigins, ",")...)
		}

		isAllowed := false
		for _, o := range allowedOrigins {
			if origin == o {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	
	// Public Auth routes (Rate Limited)
	authGroup := api.Group("/auth")
	authGroup.Use(middleware.RateLimiter())
	{
		authGroup.POST("/register", handlers.Register)
		authGroup.POST("/login", handlers.Login)
		authGroup.POST("/logout", handlers.Logout)
	}

	// Protected Auth route (for session check)
	api.GET("/auth/me", middleware.RequireAuth(), handlers.Me)

	// Public Content routes
	api.GET("/contents", handlers.GetAllContent)
	api.GET("/contents/:slug", handlers.GetContentBySlug)
	api.GET("/search", handlers.SearchContent)

	// Protected CRM routes
	protected := api.Group("/crm")
	protected.Use(middleware.RequireAuth())
	protected.Use(middleware.RequireEditor())
	{
		protected.GET("/contents", handlers.GetMyContent)
		protected.POST("/contents", handlers.CreateContent)
		protected.PUT("/contents/reorder", handlers.ReorderContents)
		protected.PUT("/contents/:id", handlers.UpdateContent)
		protected.DELETE("/contents/:id", handlers.DeleteContent)
	}

	r.Run(":8087") // Listen and serve on 0.0.0.0:8080
}

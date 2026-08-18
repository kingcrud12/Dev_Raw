package main

import (
	"api/database"
	"api/handlers"
	"api/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
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

	// CORS Middleware (simple version for local dev)
	r.Use(func(c *gin.Context) {
		frontendURL := os.Getenv("FRONTEND_URL")
		if frontendURL == "" {
			frontendURL = "http://localhost:5174"
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", frontendURL)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

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

	// Public Content route
	api.GET("/contents", handlers.GetAllContent)

	// Protected CRM routes
	protected := api.Group("/crm")
	protected.Use(middleware.RequireAuth())
	protected.Use(middleware.RequireEditor())
	{
		protected.GET("/contents", handlers.GetMyContent)
		protected.POST("/contents", handlers.CreateContent)
		protected.PUT("/contents/:id", handlers.UpdateContent)
		protected.DELETE("/contents/:id", handlers.DeleteContent)
	}

	r.Run(":8080") // Listen and serve on 0.0.0.0:8080
}

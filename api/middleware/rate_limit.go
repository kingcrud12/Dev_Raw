package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

var (
	visitors = make(map[string]*rate.Limiter)
	mu       sync.Mutex
)

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := visitors[ip]
	if !exists {
		// Limit to 5 requests per minute per IP for sensitive routes (login/register)
		limiter = rate.NewLimiter(rate.Every(time.Minute/5), 5)
		visitors[ip] = limiter
	}

	return limiter
}

func RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getVisitor(ip)
		
		if !limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Trop de requêtes, veuillez réessayer plus tard.",
			})
			return
		}
		c.Next()
	}
}

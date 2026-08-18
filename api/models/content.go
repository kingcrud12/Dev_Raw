package models

import "github.com/google/uuid"

type ContentType string

const (
	TypeArticle  ContentType = "article"
	TypeGuide    ContentType = "guide"
	TypeTutorial ContentType = "tutorial"
)

type Content struct {
	Base
	Type        ContentType `gorm:"index;not null" json:"type"`
	Title       string      `gorm:"not null" json:"title"`
	Description string      `json:"description"`
	ImageUrl    string      `json:"imageUrl"`
	Tags        string      `json:"tags"`
	ContentText string      `json:"contentText"`
	ReadingTime int         `json:"readingTime"`
	AuthorID    uuid.UUID   `json:"-"`
	Author      User        `gorm:"foreignKey:AuthorID" json:"-"`
}

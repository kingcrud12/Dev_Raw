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
	Slug        string      `gorm:"uniqueIndex;not null" json:"slug"`
	Title       string      `gorm:"not null" json:"title"`
	TitleEn     string      `json:"titleEn"`
	Description string      `json:"description"`
	DescriptionEn string    `json:"descriptionEn"`
	ImageUrl    string      `json:"imageUrl"`
	Tags        string      `json:"tags"`
	ContentText string      `json:"contentText"`
	ContentTextEn string    `json:"contentTextEn"`
	ReadingTime   int         `json:"readingTime"`
	OrderPosition int         `json:"orderPosition"`
	AuthorID      uuid.UUID   `json:"-"`
	Author        User        `gorm:"foreignKey:AuthorID" json:"-"`
}

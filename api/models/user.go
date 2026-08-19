package models

type Role string

const (
	RoleUser   Role = "user"
	RoleEditor Role = "editor"
	RoleAdmin  Role = "admin"
)

type User struct {
	Base
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Role     Role   `gorm:"default:'user';not null" json:"role"`
}

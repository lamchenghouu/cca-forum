package models

type Post struct {
	Id       	uint      `json:"id"`
	Content  	string    `json:"content"`
	UserId   	uint      `json:"user_id"` // refers to Id in User struct
	User     	User      `json:"user" gorm:"foreignKey:UserId"` // nested User object i.e. the Poster of this Post
	Comments 	[]Comment `json:"comments" gorm:"foreignKey:PostId"` // slice of Comment objects
	Likes		int		  `json:"likes"` 
	Tag 		string	  `json:"tag"`
	CreatedAt 	string    `json:"created_at"`
}

type Comment struct {
	Id      uint   `json:"id"`
	PostId  uint   `json:"post_id"` // refers to the primary key 'Id' of the Post object
	Content string `json:"content"`
	UserId  uint   `json:"user_id"` // refers to the primary key 'Id' of the User object
	User    User   `json:"user" gorm:"foreignKey:UserId"` // nested User object, with foreign key reference set with GORM
	Post    Post   `json:"post" gorm:"foreignKey:PostId"` // nested Post object, with foreign key reference set with GORM
}

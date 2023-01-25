package models

type User struct {
	Id          uint   `json:"id"`
	UserName    string `gorm:"unique; not null" json:"user_name"`
	Password    []byte `gorm:"not null" json:"-"` // password not shown
	SecurityQns string `gorm:"not null" json:"security_qns"`
	SecurityAns []byte `gorm:"not null" json:"-"`
	Likes       string `json:"likes"` // stores the id of posts which user has liked, delimiter=" "
}

/* NOTES /
(user *User) <method>(...) is to reference the class which <method> belongs to

You can use this in the future to make your program more abstract.
*/

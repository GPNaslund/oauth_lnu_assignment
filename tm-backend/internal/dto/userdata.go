package dto

// Represents the UserData extracted from the id_token.
type UserData struct {
	Name     string `json:"name"`
	Username string `json:"preferred_username"`
	UserId   string `json:"sub"`
	Avatar   string `json:"picture"`
}

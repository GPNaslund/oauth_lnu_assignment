package jwt

import (
	"1dv027/wt1/internal/dto"
	"context"
	"fmt"
	"os"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

// Struct with JWT functionality.
type JwtService struct{}

// Constructor method.
func NewJwtService() *JwtService {
	return &JwtService{}
}

// Method for extracting user info from JWT and return DTO.
func (j *JwtService) GetUserDataFromJwt(idToken string) (*dto.UserData, error) {

	token, err := j.validateToken(idToken)
	if err != nil {
		return nil, err
	}

	return j.extractClaims(token)
}

// Method for validating JWT.
func (j *JwtService) validateToken(idToken string) (jwt.Token, error) {
	jwksUrl := os.Getenv("JWKS_URL")

	set, err := jwk.Fetch(context.Background(), jwksUrl)
	if err != nil {
		return nil, err
	}

	token, err := jwt.Parse(
		[]byte(idToken),
		jwt.WithKeySet(set),
		jwt.WithValidate(true),
		jwt.WithIssuer(os.Getenv("ISSUER_CLAIM_URL")),
		jwt.WithAcceptableSkew(10*time.Second),
	)

	if err != nil {
		return nil, err
	}

	return token, nil
}

// Method for extracting specified claims.
func (j *JwtService) extractClaims(token jwt.Token) (*dto.UserData, error) {
	userData := dto.UserData{}

	if value, ok := token.Get("name"); ok {
		userData.Name, _ = value.(string)
	} else {
		return nil, fmt.Errorf("name claim not found")
	}

	if value, ok := token.Get("preferred_username"); ok {
		userData.Username, _ = value.(string)
	} else {
		return nil, fmt.Errorf("preferred_username claim not found")
	}

	if value, ok := token.Get("sub"); ok {
		userData.UserId, _ = value.(string)
	} else {
		return nil, fmt.Errorf("sub claim not found")
	}

	if value, ok := token.Get("picture"); ok {
		userData.Avatar, _ = value.(string)
	} else {
		return nil, fmt.Errorf("picture claim not found")
	}

	return &userData, nil
}

package apiv1handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// Handler for /verify endpoint.
type VerifyHandler struct{}

// Constructor method
func NewVerifyHandler() *VerifyHandler {
	return &VerifyHandler{}
}

// Method for checking if there is an active/stored session.
func (a *VerifyHandler) Verify(c *fiber.Ctx, store *session.Store) error {
	session, err := store.Get(c)
	if err != nil {
		log.Infof("Verify: Failed to get session")
		return fiber.ErrInternalServerError
	}

	at := session.Get("access_token")

	if at != nil {
		accessToken, okAt := at.(string)

		if !okAt {
			log.Infof("Verify: Failed to type cast at to string")
			return fiber.ErrInternalServerError
		}

		return c.JSON(fiber.Map{
			"access_token": accessToken,
		})
	}
	return fiber.ErrUnauthorized
}

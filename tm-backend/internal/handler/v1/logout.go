package apiv1handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// Handler for /logout endpoint
type LogoutHandler struct{}

// Constructor method
func NewLogoutHandler() *LogoutHandler {
	return &LogoutHandler{}
}

// Method for removing session.
func (*LogoutHandler) Logout(c *fiber.Ctx, store *session.Store) error {
	session, err := store.Get(c)
	if err != nil {
		log.Infof("Logout: Failed to get store")
		return fiber.ErrInternalServerError
	}

	err = session.Destroy()
	if err != nil {
		log.Infof("Logout: Failed to destroy session")
		return fiber.ErrInternalServerError
	}

	return c.SendStatus(200)
}

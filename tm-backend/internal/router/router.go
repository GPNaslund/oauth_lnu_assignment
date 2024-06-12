package router

import (
	"1dv027/wt1/internal/config"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
)

type IocContainer interface {
	Resolve(name string, lifecycle config.Lifecycle) any
}

type VerifyHandler interface {
	Verify(c *fiber.Ctx, store *session.Store) error
}

type LoginHandler interface {
	Login(c *fiber.Ctx, store *session.Store) error
}

type TokenHandler interface {
	Handle(c *fiber.Ctx, store *session.Store) error
}

type LogoutHandler interface {
	Logout(c *fiber.Ctx, store *session.Store) error
}

type RefreshHandler interface {
	Refresh(c *fiber.Ctx, store *session.Store) error
}

// The main router
type Router struct {
	container IocContainer
}

// Constructor method
func NewRouter(container IocContainer) *Router {
	return &Router{
		container: container,
	}
}

// Method for initialize the router.
func (r *Router) Start() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		// Development only
		AllowOrigins: "*",
		AllowMethods: "GET, POST, DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// In memory session store.
	store := session.New(session.Config{
		Expiration:     30 * time.Minute,
		CookieDomain:   "",
		CookieHTTPOnly: true,
		CookieSameSite: "Strict",
		CookieSecure:   true,
	})

	basePath := os.Getenv("BASE_PATH")

	api := app.Group(basePath + "/api")

	v1 := api.Group("/v1")

	auth := v1.Group("/auth")

	auth.Get("/verify", func(c *fiber.Ctx) error {
		verifyHandler := r.container.Resolve("VerifyHandler", config.Transient).(VerifyHandler)
		return verifyHandler.Verify(c, store)
	})

	auth.Get("/login", func(c *fiber.Ctx) error {
		loginHandler := r.container.Resolve("LoginHandler", config.Transient).(LoginHandler)
		return loginHandler.Login(c, store)
	})

	auth.Post("/token", func(c *fiber.Ctx) error {
		tokenHandler := r.container.Resolve("TokenHandler", config.Transient).(TokenHandler)
		return tokenHandler.Handle(c, store)
	})

	auth.Delete("/logout", func(c *fiber.Ctx) error {
		logoutHandler := r.container.Resolve("LogoutHandler", config.Transient).(LogoutHandler)
		return logoutHandler.Logout(c, store)
	})

	auth.Post("/refresh", func(c *fiber.Ctx) error {
		refreshHandler := r.container.Resolve("RefreshHandler", config.Transient).(RefreshHandler)
		return refreshHandler.Refresh(c, store)
	})

	absPath, err := filepath.Abs("./internal/public")
	if err != nil {
		log.Fatalf("Failed to get absolute path: %v", err)
	}

	app.Static(basePath+"/", absPath)

	// Serve SPA app for everything that is not explicitly set above.
	app.Get(basePath+"/*", func(c *fiber.Ctx) error {
		return c.SendFile(filepath.Join(absPath, "index.html"))
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}

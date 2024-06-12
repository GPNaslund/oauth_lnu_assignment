package config

import (
	apiv1handler "1dv027/wt1/internal/handler/v1"
	jwt "1dv027/wt1/internal/service"
)

// Setup for the IoC container
func SetupContainer() *Container {
	c := NewContainer()

	c.ProvideTransient("LoginHandler", func() any {
		return apiv1handler.NewLoginHandler()
	})

	c.ProvideTransient("LogoutHandler", func() any {
		return apiv1handler.NewLogoutHandler()
	})

	c.ProvideTransient("RefreshHandler", func() any {
		return apiv1handler.NewRefreshHandler()
	})

	c.ProvideTransient("JwtService", func() any {
		return jwt.NewJwtService()
	})

	c.ProvideTransient("TokenHandler", func() any {
		jwtService := c.Resolve("JwtService", Transient).(apiv1handler.JwtService)
		return apiv1handler.NewTokenHandler(jwtService)
	})

	c.ProvideTransient("VerifyHandler", func() any {
		return apiv1handler.NewVerifyHandler()
	})

	return c
}

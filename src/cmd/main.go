package main

import (
	"net/http"
	"time"

	"github.com/a-h/templ"
	"github.com/aamirazad/calos/src/templates"
	"github.com/labstack/echo/v4"
)

func main() {
	app := echo.New()
	app.Static("/static", "./src/static")
	app.GET("/", HomeHandler)
	app.GET("/api/time", TimeHandler)
	app.Logger.Fatal(app.Start(":8080"))
}

// This custom Render replaces Echo's echo.Context.Render() with templ's templ.Component.Render().
func Render(ctx echo.Context, statusCode int, t templ.Component) error {
	buf := templ.GetBuffer()
	defer templ.ReleaseBuffer(buf)

	if err := t.Render(ctx.Request().Context(), buf); err != nil {
		return err
	}

	return ctx.HTML(statusCode, buf.String())
}

func HomeHandler(c echo.Context) error {
	return Render(c, http.StatusOK, templates.Home())
}

func TimeHandler(c echo.Context) error {
	return c.HTML(http.StatusOK, `The current time is `+time.Now().Format(time.RFC3339))
}

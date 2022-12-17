package router

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"microblog/common"
	"microblog/middleware"
	"net/http"
)

func setWebRouter(router *gin.Engine) {
	router.Use(middleware.Cache())
	if common.Theme[0] == '.' || common.Theme[0] == '/' {
		// using third party themes
		router.Use(static.Serve("/", static.LocalFile(common.Theme, true)))
	} else {
		// using built in themes
		router.Use(static.Serve("/", common.EmbedFolder(common.FS, "theme/"+common.Theme)))
	}
	router.NoRoute(func(c *gin.Context) {
		c.Status(http.StatusNotFound)
	})
}

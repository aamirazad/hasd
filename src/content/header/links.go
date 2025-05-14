package header

type MenuItem struct {
	Name string
	URL  string
}

var MenuLinks = []MenuItem{
	{Name: "Home", URL: "#"},
	{Name: "About", URL: "#"},
	{Name: "Docs", URL: "#"},
	{Name: "Blog", URL: "#"},
	{Name: "Recipes", URL: "#"},
	{Name: "Poetry", URL: "#"},
	{Name: "Index Cards", URL: "#"},
	{Name: "Authors", URL: "#"},
	{Name: "Portfolio", URL: "#"},
}

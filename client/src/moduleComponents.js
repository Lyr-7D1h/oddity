export default {
	"Example Module": [
		{
			path: "/",
			component: require("../../modules/example_module/client/components/index").default
		}
,		{
			path: "/sub-example",
			component: require("../../modules/example_module/client/components/Example").default
		}
,		{
			path: "/sub-example/:param",
			component: require("../../modules/example_module/client/components/Example").default
		}
	]
,	"Forum": [
		{
			path: "/",
			component: require("../../modules/forum/client/components/index").default
		}
,		{
			path: "/:category/",
			component: require("../../modules/forum/client/components/index").default
		}
,		{
			path: "/:category/:thread/",
			component: require("../../modules/forum/client/components/index").default
		}
,		{
			path: "/:category/:thread/:post/",
			component: require("../../modules/forum/client/components/index").default
		}
	]
,	"Members": [
		{
			path: "/",
			component: require("../../modules/members/client/components/index.jsx").default
		},
	]
,	"Home": [
		{
			path: "/",
			component: require("../../modules/home_module/client/components/index.jsx").default
		},
	]
,	"Servers": [
		{
			path: "/",
			component: require("../../modules/servers/client/components/index.jsx").default
		},
	]

}
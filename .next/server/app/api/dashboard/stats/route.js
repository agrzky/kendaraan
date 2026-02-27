"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/dashboard/stats/route";
exports.ids = ["app/api/dashboard/stats/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Fstats%2Froute&page=%2Fapi%2Fdashboard%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Fstats%2Froute.ts&appDir=D%3A%5Ckendaraan%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Ckendaraan&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Fstats%2Froute&page=%2Fapi%2Fdashboard%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Fstats%2Froute.ts&appDir=D%3A%5Ckendaraan%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Ckendaraan&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_kendaraan_app_api_dashboard_stats_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/dashboard/stats/route.ts */ \"(rsc)/./app/api/dashboard/stats/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/dashboard/stats/route\",\n        pathname: \"/api/dashboard/stats\",\n        filename: \"route\",\n        bundlePath: \"app/api/dashboard/stats/route\"\n    },\n    resolvedPagePath: \"D:\\\\kendaraan\\\\app\\\\api\\\\dashboard\\\\stats\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_kendaraan_app_api_dashboard_stats_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/dashboard/stats/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZkYXNoYm9hcmQlMkZzdGF0cyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZGFzaGJvYXJkJTJGc3RhdHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZkYXNoYm9hcmQlMkZzdGF0cyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDa2VuZGFyYWFuJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDa2VuZGFyYWFuJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDRztBQUNoRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL215LXYwLXByb2plY3QvPzQ0NzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRDpcXFxca2VuZGFyYWFuXFxcXGFwcFxcXFxhcGlcXFxcZGFzaGJvYXJkXFxcXHN0YXRzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZGFzaGJvYXJkL3N0YXRzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZGFzaGJvYXJkL3N0YXRzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9kYXNoYm9hcmQvc3RhdHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxrZW5kYXJhYW5cXFxcYXBwXFxcXGFwaVxcXFxkYXNoYm9hcmRcXFxcc3RhdHNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2Rhc2hib2FyZC9zdGF0cy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Fstats%2Froute&page=%2Fapi%2Fdashboard%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Fstats%2Froute.ts&appDir=D%3A%5Ckendaraan%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Ckendaraan&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/dashboard/stats/route.ts":
/*!******************************************!*\
  !*** ./app/api/dashboard/stats/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\n// Force dynamic rendering to get real-time data from database\nconst dynamic = \"force-dynamic\";\nasync function GET(request) {\n    try {\n        // User info is injected by middleware\n        const userId = request.headers.get(\"x-user-id\");\n        const userRole = request.headers.get(\"x-user-role\");\n        // Get start of current month for completed this month query\n        const startOfMonth = new Date();\n        startOfMonth.setDate(1);\n        startOfMonth.setHours(0, 0, 0, 0);\n        // Get 6 months ago for monthly trend\n        const sixMonthsAgo = new Date();\n        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);\n        // Build where clause based on role\n        // Admin sees all, users see only their vehicles\n        const vehicleWhereClause = userRole === \"admin\" ? {} : {\n            ownerId: userId || undefined\n        };\n        // Get vehicle IDs for this user (for filtering maintenances)\n        const userVehicleIds = userRole === \"admin\" ? undefined // Admin sees all\n         : (await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.vehicle.findMany({\n            where: {\n                ownerId: userId || undefined\n            },\n            select: {\n                id: true\n            }\n        })).map((v)=>v.id);\n        const maintenanceWhereClause = userRole === \"admin\" ? {} : {\n            vehicleId: {\n                in: userVehicleIds\n            }\n        };\n        // Execute all queries in parallel for maximum performance\n        const [totalVehicles, activeVehicles, pendingServices, inProgressServices, completedServices, completedThisMonth, totalMaintenances, maintenancesByStatus, monthlyMaintenances, recentMaintenances, vehiclesByFuelType] = await Promise.all([\n            // Vehicle counts (filtered by role)\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.vehicle.count({\n                where: vehicleWhereClause\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.vehicle.count({\n                where: {\n                    ...vehicleWhereClause,\n                    status: \"active\"\n                }\n            }),\n            // Maintenance counts by status (filtered by role)\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.count({\n                where: {\n                    ...maintenanceWhereClause,\n                    status: \"pending\"\n                }\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.count({\n                where: {\n                    ...maintenanceWhereClause,\n                    status: \"in-progress\"\n                }\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.count({\n                where: {\n                    ...maintenanceWhereClause,\n                    status: \"completed\"\n                }\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.count({\n                where: {\n                    ...maintenanceWhereClause,\n                    status: \"completed\",\n                    maintenanceDate: {\n                        gte: startOfMonth\n                    }\n                }\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.count({\n                where: maintenanceWhereClause\n            }),\n            // Grouped queries\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.groupBy({\n                by: [\n                    \"status\"\n                ],\n                where: maintenanceWhereClause,\n                _count: {\n                    status: true\n                }\n            }),\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.groupBy({\n                by: [\n                    \"maintenanceDate\"\n                ],\n                where: {\n                    ...maintenanceWhereClause,\n                    maintenanceDate: {\n                        gte: sixMonthsAgo\n                    }\n                },\n                _count: {\n                    id: true\n                }\n            }),\n            // Recent maintenances with vehicle info\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.maintenance.findMany({\n                where: maintenanceWhereClause,\n                take: 5,\n                orderBy: {\n                    maintenanceDate: \"desc\"\n                },\n                include: {\n                    vehicle: {\n                        select: {\n                            licensePlate: true,\n                            brand: true,\n                            model: true\n                        }\n                    }\n                }\n            }),\n            // Vehicle type distribution\n            _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.vehicle.groupBy({\n                by: [\n                    \"fuelType\"\n                ],\n                where: vehicleWhereClause,\n                _count: {\n                    fuelType: true\n                }\n            })\n        ]);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            success: true,\n            data: {\n                summary: {\n                    totalVehicles,\n                    activeVehicles,\n                    totalMaintenances,\n                    pendingServices,\n                    inProgressServices,\n                    completedServices,\n                    completedThisMonth\n                },\n                maintenancesByStatus,\n                monthlyMaintenances,\n                recentMaintenances,\n                vehiclesByFuelType\n            }\n        });\n    } catch (error) {\n        console.error(\"Error fetching dashboard stats:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            success: false,\n            error: \"Failed to fetch dashboard statistics\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2Rhc2hib2FyZC9zdGF0cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXFDO0FBQ2tCO0FBRXZELDhEQUE4RDtBQUN2RCxNQUFNRSxVQUFVLGdCQUFlO0FBRS9CLGVBQWVDLElBQUlDLE9BQW9CO0lBQzVDLElBQUk7UUFDRixzQ0FBc0M7UUFDdEMsTUFBTUMsU0FBU0QsUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUM7UUFDbkMsTUFBTUMsV0FBV0osUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUM7UUFFckMsNERBQTREO1FBQzVELE1BQU1FLGVBQWUsSUFBSUM7UUFDekJELGFBQWFFLE9BQU8sQ0FBQztRQUNyQkYsYUFBYUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHO1FBRS9CLHFDQUFxQztRQUNyQyxNQUFNQyxlQUFlLElBQUlIO1FBQ3pCRyxhQUFhQyxRQUFRLENBQUNELGFBQWFFLFFBQVEsS0FBSztRQUVoRCxtQ0FBbUM7UUFDbkMsZ0RBQWdEO1FBQ2hELE1BQU1DLHFCQUFxQlIsYUFBYSxVQUFVLENBQUMsSUFBSTtZQUFFUyxTQUFTWixVQUFVYTtRQUFVO1FBRXRGLDZEQUE2RDtRQUM3RCxNQUFNQyxpQkFBaUJYLGFBQWEsVUFDaENVLFVBQVcsaUJBQWlCO1dBQzVCLENBQUMsTUFBTWxCLCtDQUFNQSxDQUFDb0IsT0FBTyxDQUFDQyxRQUFRLENBQUM7WUFDN0JDLE9BQU87Z0JBQUVMLFNBQVNaLFVBQVVhO1lBQVU7WUFDdENLLFFBQVE7Z0JBQUVDLElBQUk7WUFBSztRQUNyQixFQUFDLEVBQUdDLEdBQUcsQ0FBQ0MsQ0FBQUEsSUFBS0EsRUFBRUYsRUFBRTtRQUVyQixNQUFNRyx5QkFBeUJuQixhQUFhLFVBQ3hDLENBQUMsSUFDRDtZQUFFb0IsV0FBVztnQkFBRUMsSUFBSVY7WUFBZTtRQUFFO1FBRXhDLDBEQUEwRDtRQUMxRCxNQUFNLENBQ0pXLGVBQ0FDLGdCQUNBQyxpQkFDQUMsb0JBQ0FDLG1CQUNBQyxvQkFD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cz9jNjZmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL3ByaXNtYSdcclxuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5cclxuLy8gRm9yY2UgZHluYW1pYyByZW5kZXJpbmcgdG8gZ2V0IHJlYWwtdGltZSBkYXRhIGZyb20gZGF0YWJhc2VcclxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSAnZm9yY2UtZHluYW1pYydcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgLy8gVXNlciBpbmZvIGlzIGluamVjdGVkIGJ5IG1pZGRsZXdhcmVcclxuICAgIGNvbnN0IHVzZXJJZCA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ3gtdXNlci1pZCcpXHJcbiAgICBjb25zdCB1c2VyUm9sZSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ3gtdXNlci1yb2xlJylcclxuXHJcbiAgICAvLyBHZXQgc3RhcnQgb2YgY3VycmVudCBtb250aCBmb3IgY29tcGxldGVkIHRoaXMgbW9udGggcXVlcnlcclxuICAgIGNvbnN0IHN0YXJ0T2ZNb250aCA9IG5ldyBEYXRlKClcclxuICAgIHN0YXJ0T2ZNb250aC5zZXREYXRlKDEpXHJcbiAgICBzdGFydE9mTW9udGguc2V0SG91cnMoMCwgMCwgMCwgMClcclxuXHJcbiAgICAvLyBHZXQgNiBtb250aHMgYWdvIGZvciBtb250aGx5IHRyZW5kXHJcbiAgICBjb25zdCBzaXhNb250aHNBZ28gPSBuZXcgRGF0ZSgpXHJcbiAgICBzaXhNb250aHNBZ28uc2V0TW9udGgoc2l4TW9udGhzQWdvLmdldE1vbnRoKCkgLSA2KVxyXG5cclxuICAgIC8vIEJ1aWxkIHdoZXJlIGNsYXVzZSBiYXNlZCBvbiByb2xlXHJcbiAgICAvLyBBZG1pbiBzZWVzIGFsbCwgdXNlcnMgc2VlIG9ubHkgdGhlaXIgdmVoaWNsZXNcclxuICAgIGNvbnN0IHZlaGljbGVXaGVyZUNsYXVzZSA9IHVzZXJSb2xlID09PSAnYWRtaW4nID8ge30gOiB7IG93bmVySWQ6IHVzZXJJZCB8fCB1bmRlZmluZWQgfVxyXG4gICAgXHJcbiAgICAvLyBHZXQgdmVoaWNsZSBJRHMgZm9yIHRoaXMgdXNlciAoZm9yIGZpbHRlcmluZyBtYWludGVuYW5jZXMpXHJcbiAgICBjb25zdCB1c2VyVmVoaWNsZUlkcyA9IHVzZXJSb2xlID09PSAnYWRtaW4nIFxyXG4gICAgICA/IHVuZGVmaW5lZCAgLy8gQWRtaW4gc2VlcyBhbGxcclxuICAgICAgOiAoYXdhaXQgcHJpc21hLnZlaGljbGUuZmluZE1hbnkoe1xyXG4gICAgICAgICAgd2hlcmU6IHsgb3duZXJJZDogdXNlcklkIHx8IHVuZGVmaW5lZCB9LFxyXG4gICAgICAgICAgc2VsZWN0OiB7IGlkOiB0cnVlIH1cclxuICAgICAgICB9KSkubWFwKHYgPT4gdi5pZClcclxuXHJcbiAgICBjb25zdCBtYWludGVuYW5jZVdoZXJlQ2xhdXNlID0gdXNlclJvbGUgPT09ICdhZG1pbicgXHJcbiAgICAgID8ge30gXHJcbiAgICAgIDogeyB2ZWhpY2xlSWQ6IHsgaW46IHVzZXJWZWhpY2xlSWRzIH0gfVxyXG5cclxuICAgIC8vIEV4ZWN1dGUgYWxsIHF1ZXJpZXMgaW4gcGFyYWxsZWwgZm9yIG1heGltdW0gcGVyZm9ybWFuY2VcclxuICAgIGNvbnN0IFtcclxuICAgICAgdG90YWxWZWhpY2xlcyxcclxuICAgICAgYWN0aXZlVmVoaWNsZXMsXHJcbiAgICAgIHBlbmRpbmdTZXJ2aWNlcyxcclxuICAgICAgaW5Qcm9ncmVzc1NlcnZpY2VzLFxyXG4gICAgICBjb21wbGV0ZWRTZXJ2aWNlcyxcclxuICAgICAgY29tcGxldGVkVGhpc01vbnRoLFxyXG4gICAgICB0b3RhbE1haW50ZW5hbmNlcyxcclxuICAgICAgbWFpbnRlbmFuY2VzQnlTdGF0dXMsXHJcbiAgICAgIG1vbnRobHlNYWludGVuYW5jZXMsXHJcbiAgICAgIHJlY2VudE1haW50ZW5hbmNlcyxcclxuICAgICAgdmVoaWNsZXNCeUZ1ZWxUeXBlLFxyXG4gICAgXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgLy8gVmVoaWNsZSBjb3VudHMgKGZpbHRlcmVkIGJ5IHJvbGUpXHJcbiAgICAgIHByaXNtYS52ZWhpY2xlLmNvdW50KHsgd2hlcmU6IHZlaGljbGVXaGVyZUNsYXVzZSB9KSxcclxuICAgICAgcHJpc21hLnZlaGljbGUuY291bnQoeyB3aGVyZTogeyAuLi52ZWhpY2xlV2hlcmVDbGF1c2UsIHN0YXR1czogJ2FjdGl2ZScgfSB9KSxcclxuXHJcbiAgICAgIC8vIE1haW50ZW5hbmNlIGNvdW50cyBieSBzdGF0dXMgKGZpbHRlcmVkIGJ5IHJvbGUpXHJcbiAgICAgIHByaXNtYS5tYWludGVuYW5jZS5jb3VudCh7IHdoZXJlOiB7IC4uLm1haW50ZW5hbmNlV2hlcmVDbGF1c2UsIHN0YXR1czogJ3BlbmRpbmcnIH0gfSksXHJcbiAgICAgIHByaXNtYS5tYWludGVuYW5jZS5jb3VudCh7IHdoZXJlOiB7IC4uLm1haW50ZW5hbmNlV2hlcmVDbGF1c2UsIHN0YXR1czogJ2luLXByb2dyZXNzJyB9IH0pLFxyXG4gICAgICBwcmlzbWEubWFpbnRlbmFuY2UuY291bnQoeyB3aGVyZTogeyAuLi5tYWludGVuYW5jZVdoZXJlQ2xhdXNlLCBzdGF0dXM6ICdjb21wbGV0ZWQnIH0gfSksXHJcbiAgICAgIHByaXNtYS5tYWludGVuYW5jZS5jb3VudCh7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgIC4uLm1haW50ZW5hbmNlV2hlcmVDbGF1c2UsXHJcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxyXG4gICAgICAgICAgbWFpbnRlbmFuY2VEYXRlOiB7IGd0ZTogc3RhcnRPZk1vbnRoIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBwcmlzbWEubWFpbnRlbmFuY2UuY291bnQoeyB3aGVyZTogbWFpbnRlbmFuY2VXaGVyZUNsYXVzZSB9KSxcclxuXHJcbiAgICAgIC8vIEdyb3VwZWQgcXVlcmllc1xyXG4gICAgICBwcmlzbWEubWFpbnRlbmFuY2UuZ3JvdXBCeSh7XHJcbiAgICAgICAgYnk6IFsnc3RhdHVzJ10sXHJcbiAgICAgICAgd2hlcmU6IG1haW50ZW5hbmNlV2hlcmVDbGF1c2UsXHJcbiAgICAgICAgX2NvdW50OiB7IHN0YXR1czogdHJ1ZSB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBwcmlzbWEubWFpbnRlbmFuY2UuZ3JvdXBCeSh7XHJcbiAgICAgICAgYnk6IFsnbWFpbnRlbmFuY2VEYXRlJ10sXHJcbiAgICAgICAgd2hlcmU6IHsgXHJcbiAgICAgICAgICAuLi5tYWludGVuYW5jZVdoZXJlQ2xhdXNlLFxyXG4gICAgICAgICAgbWFpbnRlbmFuY2VEYXRlOiB7IGd0ZTogc2l4TW9udGhzQWdvIH0gXHJcbiAgICAgICAgfSxcclxuICAgICAgICBfY291bnQ6IHsgaWQ6IHRydWUgfVxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFJlY2VudCBtYWludGVuYW5jZXMgd2l0aCB2ZWhpY2xlIGluZm9cclxuICAgICAgcHJpc21hLm1haW50ZW5hbmNlLmZpbmRNYW55KHtcclxuICAgICAgICB3aGVyZTogbWFpbnRlbmFuY2VXaGVyZUNsYXVzZSxcclxuICAgICAgICB0YWtlOiA1LFxyXG4gICAgICAgIG9yZGVyQnk6IHsgbWFpbnRlbmFuY2VEYXRlOiAnZGVzYycgfSxcclxuICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICB2ZWhpY2xlOiB7XHJcbiAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgIGxpY2Vuc2VQbGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBicmFuZDogdHJ1ZSxcclxuICAgICAgICAgICAgICBtb2RlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFZlaGljbGUgdHlwZSBkaXN0cmlidXRpb25cclxuICAgICAgcHJpc21hLnZlaGljbGUuZ3JvdXBCeSh7XHJcbiAgICAgICAgYnk6IFsnZnVlbFR5cGUnXSxcclxuICAgICAgICB3aGVyZTogdmVoaWNsZVdoZXJlQ2xhdXNlLFxyXG4gICAgICAgIF9jb3VudDogeyBmdWVsVHlwZTogdHJ1ZSB9XHJcbiAgICAgIH0pLFxyXG4gICAgXSlcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgc3VtbWFyeToge1xyXG4gICAgICAgICAgdG90YWxWZWhpY2xlcyxcclxuICAgICAgICAgIGFjdGl2ZVZlaGljbGVzLFxyXG4gICAgICAgICAgdG90YWxNYWludGVuYW5jZXMsXHJcbiAgICAgICAgICBwZW5kaW5nU2VydmljZXMsXHJcbiAgICAgICAgICBpblByb2dyZXNzU2VydmljZXMsXHJcbiAgICAgICAgICBjb21wbGV0ZWRTZXJ2aWNlcyxcclxuICAgICAgICAgIGNvbXBsZXRlZFRoaXNNb250aCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1haW50ZW5hbmNlc0J5U3RhdHVzLFxyXG4gICAgICAgIG1vbnRobHlNYWludGVuYW5jZXMsXHJcbiAgICAgICAgcmVjZW50TWFpbnRlbmFuY2VzLFxyXG4gICAgICAgIHZlaGljbGVzQnlGdWVsVHlwZSxcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZGFzaGJvYXJkIHN0YXRzOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBkYXNoYm9hcmQgc3RhdGlzdGljcycgfSxcclxuICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJwcmlzbWEiLCJOZXh0UmVzcG9uc2UiLCJkeW5hbWljIiwiR0VUIiwicmVxdWVzdCIsInVzZXJJZCIsImhlYWRlcnMiLCJnZXQiLCJ1c2VyUm9sZSIsInN0YXJ0T2ZNb250aCIsIkRhdGUiLCJzZXREYXRlIiwic2V0SG91cnMiLCJzaXhNb250aHNBZ28iLCJzZXRNb250aCIsImdldE1vbnRoIiwidmVoaWNsZVdoZXJlQ2xhdXNlIiwib3duZXJJZCIsInVuZGVmaW5lZCIsInVzZXJWZWhpY2xlSWRzIiwidmVoaWNsZSIsImZpbmRNYW55Iiwid2hlcmUiLCJzZWxlY3QiLCJpZCIsIm1hcCIsInYiLCJtYWludGVuYW5jZVdoZXJlQ2xhdXNlIiwidmVoaWNsZUlkIiwiaW4iLCJ0b3RhbFZlaGljbGVzIiwiYWN0aXZlVmVoaWNsZXMiLCJwZW5kaW5nU2VydmljZXMiLCJpblByb2dyZXNzU2VydmljZXMiLCJjb21wbGV0ZWRTZXJ2aWNlcyIsImNvbXBsZXRlZFRoaXNNb250aCIsInRvdGFsTWFpbnRlbmFuY2VzIiwibWFpbnRlbmFuY2VzQnlTdGF0dXMiLCJtb250aGx5TWFpbnRlbmFuY2VzIiwicmVjZW50TWFpbnRlbmFuY2VzIiwidmVoaWNsZXNCeUZ1ZWxUeXBlIiwiUHJvbWlzZSIsImFsbCIsImNvdW50Iiwic3RhdHVzIiwibWFpbnRlbmFuY2UiLCJtYWludGVuYW5jZURhdGUiLCJndGUiLCJncm91cEJ5IiwiYnkiLCJfY291bnQiLCJ0YWtlIiwib3JkZXJCeSIsImluY2x1ZGUiLCJsaWNlbnNlUGxhdGUiLCJicmFuZCIsIm1vZGVsIiwiZnVlbFR5cGUiLCJqc29uIiwic3VjY2VzcyIsImRhdGEiLCJzdW1tYXJ5IiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/dashboard/stats/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _prisma_adapter_mariadb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prisma/adapter-mariadb */ \"(rsc)/./node_modules/@prisma/adapter-mariadb/dist/index.mjs\");\n\n\nconst globalForPrisma = globalThis;\n// Ensure DATABASE_URL is available\nconst connectionString = process.env.DATABASE_URL;\nif (!connectionString) {\n    console.error(\"❌ DATABASE_URL environment variable is not set!\");\n}\n// Create the Prisma adapter using the connection string directly\n// MariaDB adapter requires mariadb:// protocol, so we convert from mysql://\n// Also fix empty password format: root:@ -> root@\nconst mariadbUrl = connectionString?.replace(\"mysql://\", \"mariadb://\")?.replace(\":@\", \"@\") // Fix empty password format\n;\nconst adapter = mariadbUrl ? new _prisma_adapter_mariadb__WEBPACK_IMPORTED_MODULE_1__.PrismaMariaDb(mariadbUrl) : undefined;\n// Initialize Prisma Client with the adapter\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    adapter,\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\n// Cache the Prisma client in development to prevent multiple instances\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTZDO0FBQ1U7QUFFdkQsTUFBTUUsa0JBQWtCQztBQUl4QixtQ0FBbUM7QUFDbkMsTUFBTUMsbUJBQW1CQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7QUFFakQsSUFBSSxDQUFDSCxrQkFBa0I7SUFDckJJLFFBQVFDLEtBQUssQ0FBQztBQUNoQjtBQUVBLGlFQUFpRTtBQUNqRSw0RUFBNEU7QUFDNUUsa0RBQWtEO0FBQ2xELE1BQU1DLGFBQWFOLGtCQUNmTyxRQUFRLFlBQVksZUFDcEJBLFFBQVEsTUFBTSxLQUFLLDRCQUE0Qjs7QUFDbkQsTUFBTUMsVUFBVUYsYUFBYSxJQUFJVCxrRUFBYUEsQ0FBQ1MsY0FBY0c7QUFFN0QsNENBQTRDO0FBQ3JDLE1BQU1DLFNBQVNaLGdCQUFnQlksTUFBTSxJQUFJLElBQUlkLHdEQUFZQSxDQUFDO0lBQy9EWTtJQUNBRyxLQUFLVixLQUF5QixHQUFnQjtRQUFDO1FBQVM7S0FBTyxHQUFHLENBQVM7QUFDN0UsR0FBRTtBQUVGLHVFQUF1RTtBQUN2RSxJQUFJQSxJQUF5QixFQUFjO0lBQ3pDSCxnQkFBZ0JZLE1BQU0sR0FBR0E7QUFDM0I7QUFFQSxpRUFBZUEsTUFBTUEsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LXYwLXByb2plY3QvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcbmltcG9ydCB7IFByaXNtYU1hcmlhRGIgfSBmcm9tICdAcHJpc21hL2FkYXB0ZXItbWFyaWFkYidcclxuXHJcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XHJcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcclxufVxyXG5cclxuLy8gRW5zdXJlIERBVEFCQVNFX1VSTCBpcyBhdmFpbGFibGVcclxuY29uc3QgY29ubmVjdGlvblN0cmluZyA9IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTFxyXG5cclxuaWYgKCFjb25uZWN0aW9uU3RyaW5nKSB7XHJcbiAgY29uc29sZS5lcnJvcign4p2MIERBVEFCQVNFX1VSTCBlbnZpcm9ubWVudCB2YXJpYWJsZSBpcyBub3Qgc2V0IScpXHJcbn1cclxuXHJcbi8vIENyZWF0ZSB0aGUgUHJpc21hIGFkYXB0ZXIgdXNpbmcgdGhlIGNvbm5lY3Rpb24gc3RyaW5nIGRpcmVjdGx5XHJcbi8vIE1hcmlhREIgYWRhcHRlciByZXF1aXJlcyBtYXJpYWRiOi8vIHByb3RvY29sLCBzbyB3ZSBjb252ZXJ0IGZyb20gbXlzcWw6Ly9cclxuLy8gQWxzbyBmaXggZW1wdHkgcGFzc3dvcmQgZm9ybWF0OiByb290OkAgLT4gcm9vdEBcclxuY29uc3QgbWFyaWFkYlVybCA9IGNvbm5lY3Rpb25TdHJpbmdcclxuICA/LnJlcGxhY2UoJ215c3FsOi8vJywgJ21hcmlhZGI6Ly8nKVxyXG4gID8ucmVwbGFjZSgnOkAnLCAnQCcpIC8vIEZpeCBlbXB0eSBwYXNzd29yZCBmb3JtYXRcclxuY29uc3QgYWRhcHRlciA9IG1hcmlhZGJVcmwgPyBuZXcgUHJpc21hTWFyaWFEYihtYXJpYWRiVXJsKSA6IHVuZGVmaW5lZFxyXG5cclxuLy8gSW5pdGlhbGl6ZSBQcmlzbWEgQ2xpZW50IHdpdGggdGhlIGFkYXB0ZXJcclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCh7XHJcbiAgYWRhcHRlcixcclxuICBsb2c6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gWydlcnJvcicsICd3YXJuJ10gOiBbJ2Vycm9yJ10sXHJcbn0pXHJcblxyXG4vLyBDYWNoZSB0aGUgUHJpc21hIGNsaWVudCBpbiBkZXZlbG9wbWVudCB0byBwcmV2ZW50IG11bHRpcGxlIGluc3RhbmNlc1xyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWFcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpc21hXHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJQcmlzbWFNYXJpYURiIiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsImNvbm5lY3Rpb25TdHJpbmciLCJwcm9jZXNzIiwiZW52IiwiREFUQUJBU0VfVVJMIiwiY29uc29sZSIsImVycm9yIiwibWFyaWFkYlVybCIsInJlcGxhY2UiLCJhZGFwdGVyIiwidW5kZWZpbmVkIiwicHJpc21hIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/mariadb","vendor-chunks/iconv-lite","vendor-chunks/lru-cache","vendor-chunks/@prisma","vendor-chunks/denque","vendor-chunks/safer-buffer"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Fstats%2Froute&page=%2Fapi%2Fdashboard%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Fstats%2Froute.ts&appDir=D%3A%5Ckendaraan%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Ckendaraan&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
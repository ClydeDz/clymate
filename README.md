# Clymate
Clymate is a weather app that displays the current weather as well as the UV index for any given location in a beautiful interface.
Web url: [www.clymate.azurewebsites.net](http://www.clymate.azurewebsites.net).  
## Picture courtesy
Clear sky by Alexandru Tudorache, scattered clouds by Luis Poletti, thunderstorm by Sean McAuliffe, atmosphere by Marleen Trommelen,
extreme by Kien Do, rains by Lola Guti, snow by David Creixell Mediante, drizzle by Kyle Szegedi, sunrise by Nick Scheerbart,
sunset by Davide Ragusa and UV by Matthew Wiebe uploaded on [www.unsplash.com](http://www.unsplash.com).

## Known issues

1. Humidity gauge shifts to the right of the screen after changing the location or resizing the browser window on a desktop. If you
face this issue, the immediate solution is by pressing the `F12` key twice (yes, the `F12` key opens the developer tools and by
pressing the key twice you are opening and closing the developer tools window). I am working on getting this fixed.   
**Update**: This issue is now **solved**. On changing the location in the settings tab and loading the graph with new data, the graph was getting set to default width and not the width calculated after determining the size of the window. By pressing the `F12` key twice, a `window.resize` function was being called in the background which realigned the graph.  
*The Solution*: The solution was to manually trigger the window.resize when the general tab was clicked but do that only if the location is changed in the settings tab. The manual resize is triggered with a `setTimeout()` function to allow the graph to load and initialize itself first and then realign itself on the window.

2. The background cover images in the backdrop of the primary card which displays temperature in the general tab breaks when the
climate description of that location appeared as Fog or Haze. This issue is now **solved**. This was due the mapping between the
JSON response of the climate description and the images which has been reprogrammed to handle such situations.


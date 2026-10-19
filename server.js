const http = require("http");
// console.log(
//     "API key loaded:",
//     Boolean(process.env.access_key)
// );

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const url = new URL(req.url, "http://localhost:8000");

    if (url.pathname === "/api/destination") {
        const destination = url.searchParams.get("query");

        if (!destination) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: "Destination is required" }));
            return;
        }

        try {
            // https://en.wikipedia.org/api/rest_v1/page/summary/bali
            // unsplash
            const [unsplashResponse, wikiResponse] = await Promise.all([
                fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1`,
                    {
                        headers: {
                            Authorization: `Client-ID ${process.env.access_key}`
                        }
                    }
                ),
                fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}
                `)
            ]);

            if (!unsplashResponse.ok) {
                res.writeHead(unsplashResponse.status);
                res.end(JSON.stringify({
                    error: data.errors || "Unsplash request failed"
                }));
                return;
            }

            if (!wikiResponse.ok) {
                res.writeHead(wikiResponse.status);
                res.end(JSON.stringify({
                    error: wikiData.errors || "wikipedia request failed"
                }))
                return;
            }

            const [unsplashData, wikiData] = await Promise.all([
                unsplashResponse.json(),
                wikiResponse.json()
            ]);

            res.writeHead(200);
            res.end(JSON.stringify({
                destination: destination,
                photos: unsplashData.results,
                information: {
                    title: wikiData.title,
                    description: wikiData.extract,
                    // url: wikiData.content_urls?.desktop?.page
                }
            }));

        } catch (error) {
            console.error("Unsplash error:", error);

            res.writeHead(500);
            res.end(JSON.stringify({
                error: error.message || "Failed to fetch photos"
            }));
        }
    } else {
        res.end(JSON.stringify({ message: "Server is running" }));
    }
});

server.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});

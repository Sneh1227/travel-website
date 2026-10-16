
const http = require("http");
console.log(
    "API key loaded:",
    Boolean(process.env.access_key)
);

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const url = new URL(req.url, "http://localhost:8000");

    if (url.pathname === "/api/destination") {
        const destination = url.searchParams.get("query");

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1`,
                {
                    headers: {
                        Authorization: `Client-ID ${process.env.access_key}`
                    }
                }
            );

            const data = await response.json();
            if (!response.ok) {
                res.writeHead(response.status);
                res.end(JSON.stringify({
                    error: data.errors || "Unsplash request failed"
                }));
            }

            res.end(JSON.stringify(data.results));

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

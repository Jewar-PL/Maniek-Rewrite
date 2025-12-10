import express from "express";
import cors from "cors";

import fs from "fs";
import fsPromises from "fs/promises";

const app = express();

app.use(cors());

app.get("/:videoPath", async (req, res) => {
    const rangeHeader = req.headers.range;
    if (!rangeHeader) throw new Error("Requires Range header");

    const videoPath = `./videos/${req.params.videoPath}`;
    const fileData = await fsPromises.stat(videoPath);
    const videoSize = fileData.size;

    const splittedRange = rangeHeader.replace(/bytes=/, "").split("-");

    const start = parseInt(splittedRange[0]);
    const end = splittedRange[1] ? parseInt(splittedRange[1], 10) : videoSize - 1;

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    const videoStream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, headers);
    videoStream.pipe(res);
});

app.listen(8080, () => console.log("Server running on http://localhost:8080"))
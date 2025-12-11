import { Request, Response } from "express";

import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";

// TODO: Handle priority and regular
async function streamFile(req: Request, res: Response) {
    const { file } = req.params;

    const filePath = path.join(__dirname, "..", "..", "videos", file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    const fileData = await fsPromises.stat(filePath);
    const fileSize = fileData.size;

    const range = req.headers.range;
    if (!range) {
        res.writeHead(200, {
            "content-length": fileSize,
            "content-type": "video/mp4",
            "accept-ranges": "bytes"
        });

        fs.createReadStream(filePath).pipe(res);
        return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0]);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    res.writeHead(206, {
        "content-range": `bytes ${start}-${end}/${fileSize}`,
        "accept-ranges": "bytes",
        "content-length": end - start + 1,
        "content-type": "video/mp4"
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
}

// TODO: Get actual playlist
async function getPlaylist(req: Request, res: Response) {
    res.status(200).json(["LEGO1.mp4", "LEGO2.mp4"]);
}

export {
    streamFile,
    getPlaylist
}
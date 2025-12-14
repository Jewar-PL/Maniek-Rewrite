import { Request, Response } from "express";

import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

import playlistService from "../services/playlist.service";

// TODO: Handle priority and regular
async function streamFile(req: Request, res: Response) {
    const { category, file } = req.params;

    const filePath = path.join(__dirname, "..", "..", "videos", category, file);

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

// TODO: Should it be async?
async function getPlaylist(req: Request, res: Response) {
    const playlist = playlistService.playlist;

    res.status(200).json(playlist);
}

export {
    streamFile,
    getPlaylist
}
import fsPromises from "fs/promises";
import path from "path";

import usbService from "./usb.service";

class PlaylistService {
    private _playlist: string[] = [];

    public constructor() {
        usbService.on("usbAttached", async(ev) => await this.onUSBAttached(ev.filesChanged));
    
        // Get the playlist for the first time
        this.refreshPlaylist();
    }

    private async onUSBAttached(filesChanged: boolean) {
        if (filesChanged) await this.refreshPlaylist();
    }

    private async refreshPlaylist() {
        console.log(`Refreshing playlist...`);

        const videosPath = path.join(__dirname, "..", "..", "videos");
        const priorityPath = path.join(videosPath, "priority");
        const regularPath = path.join(videosPath, "regular");

        try {
            const priorityFiles = (await fsPromises.readdir(priorityPath)).map(file => `priority/${file}`);
            const regularFiles = (await fsPromises.readdir(regularPath)).map(file => `regular/${file}`);
            
            this._playlist = this.arrangePlaylist(priorityFiles, regularFiles);
        } catch (err) {
            console.error(`Error refreshing playlist: ${err}`);
            this._playlist = [];
        }
    }

    private arrangePlaylist(priority: string[], regular: string[]): string[] {
        const pCount = priority.length;
        const rCount = regular.length;

        if (rCount === 0) return priority;
        if (pCount === 0) return regular;
        if (rCount === 0 && pCount === 0) return [];

        let pIndex = 0;
        let rIndex = 0;

        const totalCycles = Math.ceil(rCount / 2) * pCount;
        const playlist = [];

        for (let cycle = 0; cycle < totalCycles; cycle++) {
            playlist.push(priority[pIndex]);

            for (let i = 0; i < 2; i++) {
                playlist.push(regular[rIndex]);
                rIndex++;
                if (rIndex >= rCount) rIndex = 0;
            }

            pIndex++;
            if (pIndex >= pCount) pIndex = 0;

            if (playlist.length >= pCount + rCount * pCount) break;
        }

        return playlist;
    }

    public get playlist(): string[] {
        return this._playlist.slice();
    }
}

export default new PlaylistService();
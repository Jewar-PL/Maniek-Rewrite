import fsPromises from "fs/promises";
import path from "path";

import usbService from "./usb.service";

class PlaylistService {
    private _playlist: string[] = [];

    public constructor() {
        usbService.on("usbAttached", async(ev) => await this.onUSBAttached(ev.filesChanged));
    }

    private async onUSBAttached(filesChanged: boolean) {
        if (filesChanged) {
            await this.refreshPlaylist();
        }
    }

    private async refreshPlaylist() {
        const videosPath = path.join(__dirname, "..", "..", "videos");
        const priorityPath = path.join(videosPath, "priority");
        const regularPath = path.join(videosPath, "regular");

        try {
            // TODO: Actual playlist algorithm
            const priorityFiles = await fsPromises.readdir(priorityPath);
            const regularFiles = await fsPromises.readdir(regularPath);
            this._playlist = [...priorityFiles, ...regularFiles];
        } catch (err) {
            console.error(`Error refreshing playlist: ${err}`);
            this._playlist = [];
        }
    }

    public get playlist(): string[] {
        return this._playlist.slice();
    }
}

export default new PlaylistService();
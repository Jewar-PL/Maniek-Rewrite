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
        // TODO: Actual algorithm
        return [...priority, ...regular];
    }

    public get playlist(): string[] {
        return this._playlist.slice();
    }
}

export default new PlaylistService();
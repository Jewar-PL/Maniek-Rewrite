import { EventEmitter } from "events";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

import { usb, Device } from "usb";
import * as drivelist from "drivelist";

// TODO: Simplify the interfaces???

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

interface USBServiceEvents {
    "usbAttached": ({ device, filesChanged }: { device: Device, filesChanged: boolean }) => void;
    "usbDetached": (dev: Device) => void;
}

declare interface USBService {
    on<U extends keyof USBServiceEvents>(
        event: U, listener: USBServiceEvents[U]
    ): this;

    emit<U extends keyof USBServiceEvents>(
        event: U, ...args: Parameters<USBServiceEvents[U]>
    ): boolean;
}

// TODO: Many of the methods are async, but should they really be?
class USBService extends EventEmitter {
    constructor() {
        super();

        usb.on("attach", this.onAttach.bind(this));
        usb.on("detach", this.onDetach.bind(this));
    }

    private async onAttach(dev: Device) {
        try {
            // The handle waits a short amount of time to make sure the drive mounts properly
            await wait(1500);

            const mountpoint = await this.getEligibleMountpoint();
            if (!mountpoint) return;

            await this.ensureLocalFoldersExist();
            
            const pDiff = await this.hasDifferentFiles(mountpoint, "priority");
            const rDiff = await this.hasDifferentFiles(mountpoint, "regular");

            if (pDiff) await this.replaceFiles(mountpoint, "priority");
            if (rDiff) await this.replaceFiles(mountpoint, "regular");

            this.emit("usbAttached", { 
                device: dev, 
                filesChanged: pDiff || rDiff 
            });
        } catch (err) {
            console.error(`USB sync error: ${err}`);
            // TODO: Should it still emit?
        }
    }

    private async onDetach(dev: Device) {
        // TODO: Do something here, or remove?
        this.emit("usbDetached", dev);
    }

    // TODO: Pass a drive as an argument instead of checking all of them here?
    // TODO: Remove logs
    /**
     * Gets the first mountpoint that belongs to a removable drive and has proper folder structure
     * @returns First eligible mountpoint if one was found, otherwise null
     */
    private async getEligibleMountpoint() {
        const drives = await drivelist.list();

        const usbDrives = drives.filter(drive => 
            drive.isRemovable &&
            drive.mountpoints &&
            drive.mountpoints.length !== 0
        );

        for (const drive of usbDrives) {
            for (const mp of drive.mountpoints) {
                const hasProperStructure = await this.hasProperFolderStructure(mp);
                
                if (hasProperStructure) return mp;
            }
        }

        return null;
    }

    /**
     * Checks if the specified mountpoint has both `priority` and `regular` folders at root
     * @param dir Mountpoint in which the function checks the constraint
     * @returns `true` if it has the proper structure, `false` otherwise
     */
    private async hasProperFolderStructure(mp: drivelist.Mountpoint) {
        // Check if the directory has priority/ and regular/ subdirectories
        const pathPriority = path.join(mp.path, "priority");
        const pathRegular = path.join(mp.path, "regular");

        // TODO: Check if it throws
        const [priority, regular] = await Promise.all([
            fsPromises.stat(pathPriority).catch(() => null),
            fsPromises.stat(pathRegular).catch(() => null),
        ]);

        return Boolean((priority && priority.isDirectory()) && (regular && regular.isDirectory()));
    }

    private async ensureLocalFoldersExist() {
        const localRoot = path.join(__dirname, "..", "..", "videos");
        
        await fsPromises.mkdir(path.join(localRoot, "priority"), { recursive: true });
        await fsPromises.mkdir(path.join(localRoot, "regular"), { recursive: true });
    }

    private async hasDifferentFiles(mp: drivelist.Mountpoint, folder: "priority" | "regular") {
        const localPath = path.join(__dirname, "..", "..", "videos", folder);
        const usbPath = path.join(mp.path, folder);

        const local = await fsPromises.readdir(localPath);
        const usb = await fsPromises.readdir(usbPath);

        if (local.length !== usb.length) return true;
        return !local.every(file => usb.includes(file));
    }

    private async replaceFiles(mp: drivelist.Mountpoint, folder: "priority" | "regular") {
        // TODO: Make this atomic swap?

        const localPath = path.join(__dirname, "..", "..", "videos", folder);
        const usbPath = path.join(mp.path, folder);
        
        const localFiles = await fsPromises.readdir(localPath);
        for (const file of localFiles) {
            await fsPromises.unlink(path.join(localPath, file));
        }

        const usbFiles = await fsPromises.readdir(usbPath);
        for (const file of usbFiles) {
            const src = path.join(usbPath, file);
            const dest = path.join(localPath, file);

            await fsPromises.copyFile(src, dest);
        }
    }
}

export default new USBService();
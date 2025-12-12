import { EventEmitter } from "events";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

import { usb, Device } from "usb";
import * as drivelist from "drivelist";


// TODO: Simplify the interfaces???

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

interface USBServiceEvents {
    "usbAttached": (dev: Device) => void;
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

class USBService extends EventEmitter {
    constructor() {
        super();

        usb.on("attach", this.onAttach.bind(this));
        usb.on("detach", this.onDetach.bind(this));
    }

    private async onAttach(dev: Device) {
        // The handle waits a short amount of time to make sure the drive mounts properly
        // TODO: Take care of this in a better way
        await wait(1500);

        // 1. Get eligible mountpoint
        // 2. Check if content in project_root/server/videos is different than mountpoint_root
        // 3. Swap out videos if they are different
        // 4. Emit event

        this.emit("usbAttached", dev);
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
            console.log(`Checking drive: ${drive.description}`);

            for (const mp of drive.mountpoints) {
                console.log(`Checking mountpoint: ${mp.path}`);

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
}

export default new USBService();
import { EventEmitter } from "events";

import { usb, Device } from "usb";

// TODO: Simplify the interfaces???

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
        // TODO: Do something here
        console.log("USB attached:\n", JSON.stringify(dev.deviceDescriptor, null, 2));
        this.emit("usbAttached", dev);
    }

    private async onDetach(dev: Device) {
        // TODO: Do something here, or remove?
        console.log("USB detached:\n", JSON.stringify(dev.deviceDescriptor, null, 2));
        this.emit("usbDetached", dev);
    }
}

export default new USBService();
import { Router } from "express";

import videoRouter from "./video.routes";

const router = Router();

// Example route
router.get("/", (req, res) => {
    res.status(200).json({ message: "I love you", sender: "Von Lycaon", recipient: "QT" });
});

router.use("/video", videoRouter);

export default router;
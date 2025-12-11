import { Router } from "express";

const router = Router();

// Example route
router.get("/", (req, res) => {
    res.status(200).json({ message: "I love you", sender: "Von Lycaon", recipient: "QT" });
});

export default router;
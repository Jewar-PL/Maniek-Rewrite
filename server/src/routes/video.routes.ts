import { Router } from "express";
import { getPlaylist, streamFile } from "../controllers/video.controller";

const router = Router();

router.get("/stream/:category/:file", streamFile);
router.get("/playlist", getPlaylist);

export default router;
import app from "./app";

import "./services/usb.service"

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
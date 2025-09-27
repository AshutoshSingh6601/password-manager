import app from './src/app.js';
import mongoose from "./src/config/db.config.js";


const port = process.env.PORT || 4000

app.listen(port, ()=> {
    console.log(`Server listening on http://localhost:${port}`)
})
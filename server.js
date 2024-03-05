import express from 'express';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 4040;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.listen(PORT, ()=>{
    console.log("hello frum the server i am here at " + PORT)
})
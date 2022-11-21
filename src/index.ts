import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { indexRoute } from './routes/index.route';
import { hodRoute } from './routes/hod.route';

dotenv.config();

const app: Express = express();

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'));

app.use('/libs', express.static(path.join(__dirname, '..', '/node_modules')));

app.use(indexRoute);
app.use(hodRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

import express from 'express';
import { AppDataSource } from './services/service-data-source/index';

const app = express();
const port = 8000;

AppDataSource.initialize()
  .then(async () => {
    app.get('/', (_, res) => {
      res.send('capstan project');
    });

    app.listen(port, async () => {
      console.log(`server is running at port: ${port}`);
    });
  })
  .catch((error) => console.log('data initialize error: ', error));

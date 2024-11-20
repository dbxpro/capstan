import express from 'express';
import { AppDataSource } from './services/service-data-source/index';
import { login } from './components/component-login/index';

const app = express();
const port = 8000;

AppDataSource.initialize()
  .then(async () => {
    app.use(express.json());

    app.get('/', (_, res) => {
      res.send('capstan project');
    });

    app.post('/login', login);

    app.listen(port, async () => {
      console.log(`server is running at port: ${port}`);
    });
  })
  .catch((error) => console.log('data initialize error: ', error));

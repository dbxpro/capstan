import express from 'express';
import { AppDataSource } from './services/service-data-source/index';
import {
  login,
  verifyToken,
} from './components/component-login/src/provider/login.provider';
import { getUserByUserID } from './components/component-tenant';

const app = express();
const port = 8000;

AppDataSource.initialize()
  .then(async () => {
    app.get('/', (_, res) => {
      res.send('capstan project');
    });

    app.use(express.json());
    app.post('/login', (req, res) => {
      login(req, res);
    });

    app.get('/user/:id', verifyToken, (req, res) => {
      getUserByUserID(req, res);
    });

    app.listen(port, async () => {
      console.log(`server is running at port: ${port}`);
    });
  })
  .catch((error) => console.log('data initialize error: ', error));

import express from 'express';
import { testTenantProvider } from './components/component-tenant/index';
import { AppDataSource } from './services/service-data-source/index';

const app = express();
const port = 3000;

app.get('/', (_, res) => {
  res.send('capstan project');
});

app.listen(port, () => {
  console.log('server is running' + testTenantProvider());
});

AppDataSource.initialize()
  .then(async () => {
    console.log('success');
  })
  .catch((error) => console.log('data initialize error: ', error));

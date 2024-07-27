import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,

  synchronize: true,
  logging: false,
  entities: ['./src/models/**/*.ts', './src/**/src/models/*.ts'],
});

export function getRepository<Entity extends ObjectLiteral>(
  entityClass: EntityTarget<Entity>
): Repository<Entity> {
  return AppDataSource.getRepository(entityClass);
}

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';
import { DatabaseService } from './../src/database/database.service';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

function assertTestDatabase(): void {
  const url = process.env.DATABASE_URL;
  const database = url ? new URL(url).pathname.replace('/', '') : '';
  if (!database.endsWith('_test')) {
    throw new Error(
      `Refusing to run e2e tests on database "${database}": its name must end with "_test".`,
    );
  }
}

assertTestDatabase();

describe('Notes API (e2e)', () => {
  let app: INestApplication<App>;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    database = app.get(DatabaseService);
  });

  beforeEach(async () => {
    await database.query('TRUNCATE TABLE notes');
  });

  afterAll(async () => {
    await app.close();
  });

  async function createNote(title: string): Promise<{ id: string }> {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send({ title, content: 'Some content' })
      .expect(201);
    return response.body as { id: string };
  }

  describe('health checks', () => {
    it('GET /health/live returns ok', async () => {
      await request(app.getHttpServer())
        .get('/health/live')
        .expect(200)
        .expect({ status: 'ok' });
    });

    it('GET /health/ready reports the database as up', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        info: { database: { status: 'up' } },
      });
    });
  });

  describe('POST /notes', () => {
    it('creates a note and stores it in the database', async () => {
      const response = await request(app.getHttpServer())
        .post('/notes')
        .send({ title: 'First note', content: 'Hello' })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'First note',
        content: 'Hello',
      });

      const rows = await database.query<{ title: string }>(
        'SELECT title FROM notes',
      );
      expect(rows).toEqual([{ title: 'First note' }]);
    });

    it('rejects an empty title', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .send({ title: '', content: 'Hello' })
        .expect(400);
    });

    it('rejects unknown fields', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .send({ title: 'Title', content: 'Hello', admin: true })
        .expect(400);
    });
  });

  describe('GET /notes', () => {
    it('lists the notes', async () => {
      await createNote('First');
      await createNote('Second');

      const response = await request(app.getHttpServer())
        .get('/notes')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /notes/:id', () => {
    it('returns an existing note', async () => {
      const { id } = await createNote('Find me');

      const response = await request(app.getHttpServer())
        .get(`/notes/${id}`)
        .expect(200);

      expect(response.body).toMatchObject({ id, title: 'Find me' });
    });

    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .get(`/notes/${UNKNOWN_ID}`)
        .expect(404);
    });

    it('returns 400 for an invalid id', async () => {
      await request(app.getHttpServer()).get('/notes/not-a-uuid').expect(400);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('deletes a note', async () => {
      const { id } = await createNote('Delete me');

      await request(app.getHttpServer()).delete(`/notes/${id}`).expect(204);
      await request(app.getHttpServer()).get(`/notes/${id}`).expect(404);
    });

    it('returns 404 when the note does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/notes/${UNKNOWN_ID}`)
        .expect(404);
    });
  });
});

import type { HealthIndicatorService } from '@nestjs/terminus';
import type { DatabaseService } from '../database/database.service';
import { DatabaseHealthIndicator } from './database.health';

const healthIndicatorService = {
  check: (key: string) => ({
    up: () => ({ [key]: { status: 'up' } }),
    down: (data: object) => ({ [key]: { status: 'down', ...data } }),
  }),
} as unknown as HealthIndicatorService;

function indicatorWith(
  query: () => Promise<unknown[]>,
): DatabaseHealthIndicator {
  const database = { query } as unknown as DatabaseService;
  return new DatabaseHealthIndicator(healthIndicatorService, database);
}

describe('DatabaseHealthIndicator', () => {
  it('reports the database as up when the query succeeds', async () => {
    const indicator = indicatorWith(() => Promise.resolve([{ '?column?': 1 }]));

    await expect(indicator.isHealthy('database')).resolves.toEqual({
      database: { status: 'up' },
    });
  });

  it('reports the database as down when the query fails', async () => {
    const indicator = indicatorWith(() =>
      Promise.reject(new Error('connection refused')),
    );

    await expect(indicator.isHealthy('database')).resolves.toEqual({
      database: { status: 'down', message: 'Database unreachable' },
    });
  });
});

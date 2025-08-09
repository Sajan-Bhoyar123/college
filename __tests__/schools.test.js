import request from 'supertest';
import express from 'express';
import { schoolsRouter } from '../src/routes/schools.js';
import { databasePool } from '../src/db/pool.js';

// Mock the database pool for testing
jest.mock('../src/db/pool.js', () => ({
  databasePool: {
    query: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/', schoolsRouter);

describe('Schools API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /addSchool', () => {
    it('should add a school successfully', async () => {
      const mockSchool = {
        name: 'Test School',
        address: '123 Test St',
        latitude: 12.9716,
        longitude: 77.5946,
      };

      databasePool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const response = await request(app)
        .post('/addSchool')
        .send(mockSchool)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        ...mockSchool,
      });

      expect(databasePool.query).toHaveBeenCalledWith(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [mockSchool.name, mockSchool.address, mockSchool.latitude, mockSchool.longitude]
      );
    });

    it('should return 400 for invalid latitude', async () => {
      const invalidSchool = {
        name: 'Test School',
        address: '123 Test St',
        latitude: 100, // Invalid latitude
        longitude: 77.5946,
      };

      const response = await request(app)
        .post('/addSchool')
        .send(invalidSchool)
        .expect(400);

      expect(response.body.error).toBe('ValidationError');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteSchool = {
        name: 'Test School',
        // Missing address, latitude, longitude
      };

      const response = await request(app)
        .post('/addSchool')
        .send(incompleteSchool)
        .expect(400);

      expect(response.body.error).toBe('ValidationError');
    });

    it('should handle database errors', async () => {
      const mockSchool = {
        name: 'Test School',
        address: '123 Test St',
        latitude: 12.9716,
        longitude: 77.5946,
      };

      databasePool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/addSchool')
        .send(mockSchool)
        .expect(500);

      expect(response.body.error).toBe('InternalServerError');
    });
  });

  describe('GET /listSchools', () => {
    it('should list schools with pagination', async () => {
      const mockSchools = [
        {
          id: 1,
          name: 'School 1',
          address: 'Address 1',
          latitude: 12.9716,
          longitude: 77.5946,
        },
        {
          id: 2,
          name: 'School 2',
          address: 'Address 2',
          latitude: 13.0827,
          longitude: 80.2707,
        },
      ];

      databasePool.query.mockResolvedValueOnce([mockSchools]);

      const response = await request(app)
        .get('/listSchools?latitude=12.9716&longitude=77.5946&page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0]).toHaveProperty('distanceKm');
    });

    it('should return 400 for invalid coordinates', async () => {
      const response = await request(app)
        .get('/listSchools?latitude=invalid&longitude=77.5946')
        .expect(400);

      expect(response.body.error).toBe('ValidationError');
    });

    it('should handle database errors', async () => {
      databasePool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/listSchools?latitude=12.9716&longitude=77.5946')
        .expect(500);

      expect(response.body.error).toBe('InternalServerError');
    });

    it('should use default pagination values', async () => {
      const mockSchools = [
        {
          id: 1,
          name: 'School 1',
          address: 'Address 1',
          latitude: 12.9716,
          longitude: 77.5946,
        },
      ];

      databasePool.query.mockResolvedValueOnce([mockSchools]);

      const response = await request(app)
        .get('/listSchools?latitude=12.9716&longitude=77.5946')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(50);
    });
  });
});

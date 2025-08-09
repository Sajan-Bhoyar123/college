import { z } from 'zod';
import { databasePool } from '../db/pool.js';

const addSchoolSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().refine((n) => Math.abs(n) <= 90, {
    message: 'latitude must be between -90 and 90',
  }),
  longitude: z.number().refine((n) => Math.abs(n) <= 180, {
    message: 'longitude must be between -180 and 180',
  }),
});

export async function addSchool(req, res) {
  try {
    const parseResult = addSchoolSchema.safeParse({
      name: req.body?.name,
      address: req.body?.address,
      latitude: typeof req.body?.latitude === 'string' ? Number(req.body.latitude) : req.body?.latitude,
      longitude: typeof req.body?.longitude === 'string' ? Number(req.body.longitude) : req.body?.longitude,
    });

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'ValidationError',
        details: parseResult.error.flatten(),
      });
    }

    const { name, address, latitude, longitude } = parseResult.data;

    const [result] = await databasePool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    return res.status(201).json({ id: result.insertId, name, address, latitude, longitude });
  } catch (error) {
    console.error('addSchool error:', error);
    return res.status(500).json({ error: 'InternalServerError' });
  }
}

const listSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function listSchools(req, res) {
  try {
    const parseResult = listSchema.safeParse({
      latitude: Number(req.query.latitude),
      longitude: Number(req.query.longitude),
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    if (!parseResult.success) {
      return res.status(400).json({ error: 'ValidationError', details: parseResult.error.flatten() });
    }

    const { latitude: userLat, longitude: userLon } = parseResult.data;
    const page = parseResult.data.page ?? 1;
    const limit = parseResult.data.limit ?? 50;
    const offset = (page - 1) * limit;

    const [allRows] = await databasePool.query('SELECT * FROM schools');

    const withDistance = allRows.map((row) => ({
      ...row,
      distanceKm: haversineDistanceKm(userLat, userLon, row.latitude, row.longitude),
    }));

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
    const total = withDistance.length;
    const items = withDistance.slice(offset, offset + limit);

    return res.json({ items, page, limit, total });
  } catch (error) {
    console.error('listSchools error:', error);
    return res.status(500).json({ error: 'InternalServerError' });
  }
}





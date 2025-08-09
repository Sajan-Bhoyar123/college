import { Router } from 'express';
import { addSchool, listSchools } from '../controllers/schoolsController.js';

export const schoolsRouter = Router();

schoolsRouter.post('/addSchool', addSchool);
schoolsRouter.get('/listSchools', listSchools);





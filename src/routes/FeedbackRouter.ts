import express from 'express';
import FeedbackController from '../controllers/FeedbackController';
import { AppDataSource } from '../config/dataSource';
import FeedbackRepository from '../repository/FeedbackRepository';
import SeniorRepository from '../repository/SeniorRepository';
import CaregiverRepository from '../repository/CaregiverRepository';

const router = express.Router();
const feedbackRepository = new FeedbackRepository(AppDataSource.getRepository('FeedbackEntity'));
const seniorRepository = new SeniorRepository(AppDataSource.getRepository('SeniorEntity'));
const caregiverRepository = new CaregiverRepository(AppDataSource.getRepository('CaregiverEntity'));

const feedbackController = new FeedbackController(feedbackRepository, seniorRepository, caregiverRepository);

router.get('/feedback', (req, res) => feedbackController.getAll(req, res));
router.get('/feedback/id/:id', (req, res) => feedbackController.getById(req, res));
router.get('/feedback/get/:id', (req, res) => feedbackController.getGiverAndReciver(req, res));
router.get('/feedback/info/:id', (req, res) => feedbackController.feedbackByGiver(req, res));
router.post('/feedback', (req, res) => feedbackController.create(req, res));
router.put('/feedback', (req, res) => feedbackController.update(req, res));
router.delete('/feedback/:id', (req, res) => feedbackController.delete(req, res));

export default router;

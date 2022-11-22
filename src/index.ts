import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getXataClient, Jobs } from './db/xata';
import { JobResponse } from './types/types';

dotenv.config();

const app: Express = express();
const xata = getXataClient();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5500;

app.use(express.json());

app.get('/api/jobs', async (_, res: Response<JobResponse<Jobs[]>>) => {
  try {
    const jobs = await xata.db.jobs.getAll();
    res.status(200).json({ data: jobs });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `${error.message}` });
    }
  }
});

app.post(
  '/api/jobs',
  async (
    req: Request<Record<string, unknown>, Record<string, unknown>, Jobs>,
    res: Response<JobResponse<Jobs>>,
  ) => {
    try {
      const job = req.body;
      const createdJob = await xata.db.jobs.create(job);

      if (createdJob) {
        res.status(201).json({ data: createdJob });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: `${error.message}` });
      }
    }
  },
);

app.put(
  '/api/jobs/:id',
  async (
    req: Request<{ id: string }, Record<string, unknown>, Jobs>,
    res: Response<JobResponse<Jobs>>,
  ) => {
    try {
      const job = req.body;
      const { id } = req.params;
      const updatedJob = await xata.db.jobs.update(id, job);

      if (updatedJob) {
        res.status(200).json({ data: updatedJob });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: `${error.message}` });
      }
    }
  },
);

app.delete(
  '/api/jobs/:id',
  async (
    req: Request<{ id: string }, Record<string, unknown>, Jobs>,
    res: Response<JobResponse<Jobs>>,
  ) => {
    try {
      const { id } = req.params;
      const deletedJob = await xata.db.jobs.delete(id);

      if (deletedJob) {
        res.status(200).json({ data: deletedJob });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: `${error.message}` });
      }
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

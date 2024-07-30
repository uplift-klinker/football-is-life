import {Router} from 'express';

export function createHealthRouter(): Router {
    const router = Router();
    router.get('/status', (req, res) => {
        res.status(200).send();
    })
    return router;
}
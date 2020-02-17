import {Router} from 'express'
import * as AppController from '../controllers/app.controller'

const router = new Router()

router.route('/apps').get(AppController.getApps); 

export default router


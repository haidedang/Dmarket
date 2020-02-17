import App from '../models/App'; 

/**
 * Get apps. 
 *
 */

 export function getApps(req, res) {
    App.find()
        .exec((err, apps) => {
            if(err) {
                res.status(500)
                    .send(err)
            }
            res.json({apps})
        })
 }

 export function getApp(req, res) {

 }

/**
 * 
 * @param {entity Object}  Entity  // This is merely adding the queried objects from the blockchain. 
 */
 export function addApp(entity) {
    const app = new App(entity);
    app.save((err,saved) => {
        if(err) {
            console.log(err)
        }
    })
 }
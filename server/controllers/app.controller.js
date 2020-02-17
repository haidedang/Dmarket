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

 // Get apps by UserId , usually we search for the author of the app. 
// if am part of the organization, the owner will be the organization, but the user still is the author! 
// The author of an app will always have rights to edit the app, but if he leaves the organization 
// then though he is the author he will loose the rights to edit this app. 
//that means if he is the author but not the owner, then he has to be a valid Delegate of the owner of entity 
// to be able to edit those apps. 

/*  export function getAppsByUserId(req, res) {
    App.find( {userId: req.params.userId})
     .exec((err, App) => {
         if(err) {
             res.status(500)
                .send(err)
         }
     })
     res.json({app: App})
 } */

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
import dbConnect from '../../../utils/dbConnect';
import Ingredient from '../../../models/Ingredient';
import Connections from '../../../models/Connections';

dbConnect();

export default async function ingredientSwitch(req, res){
    const {method} = req;

    switch(method) {
        case 'GET':
            try {
                const ingredient = await Ingredient.find({});
                res.status(200).json({success: true, data: ingredient})
            } catch (error) {
                res.status(400).json({success: false})
            }    
            break;
        case 'POST':
            try {
                // const forwarded = req.headers['x-forwarded-for'];
                // const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
                // const existingRecord = await Connections.find({connection: ip})
                // if (existingRecord.length) {
                //     if (existingRecord[0].attempt >= 4) {
                //         return res.status(200).json({success: false, blacklist: true})
                //     }
                //     if (req.body.password === process.env.PASSWORD || req.body.password === process.env.PASSWORD1 || req.body.password === process.env.PASSWORD2) {
                //         let signature;
                //         if (req.body.password === process.env.PASSWORD) {
                //             signature = 'Mom'
                //         } else if (req.body.password === process.env.PASSWORD1) {
                //             signature = 'Dad'
                //         } else if (req.body.password === process.env.PASSWORD2) {
                //             signature = 'Grandma'
                //         }
                        const data = {...req.body, password: null, date: Date.now()}
                        console.log(data, 'LETS SEE DATA ')
                        // const ingredients = await Ingredient.create(data);
        
                        res.status(201).json({success: true, data: ingredients})
                //     } else {
                //         res.status(400).json({success: false, message: 'Invalid password'})
                //     }
                // }
            } catch (error) {
                res.status(400).json({success: false})
            }
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }
}
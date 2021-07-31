import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/Item';
import Ingredient from '../../../models/Ingredient';
// import Connections from '../../../models/Connections';

dbConnect();

export default async function groceryItemSwitch(req, res){
    const {method} = req;
    // const {isConfirmed} = req.body.result

    switch(method) {
        case 'GET':
            try {
                const items = await Item.find({});
                res.status(200).json({success: true, items})
            } catch (error) {
                res.status(400).json({success: false})
            }    
            break;
        case 'POST':
            try {
            } catch (error) {
                console.log(error)
                res.status(400).json({success: false})
            }
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }
}
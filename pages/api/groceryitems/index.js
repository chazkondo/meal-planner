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
                const ingredients = await Ingredient.find({});
                res.status(200).json({success: true, groceryItems: [...items, ...ingredients]})
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
        case 'DELETE':
            await deleteItem(req, res);
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }
}


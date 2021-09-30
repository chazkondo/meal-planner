import dbConnect from '../../../utils/dbConnect';
import RecipeSchema from '../../../models/Recipe';
import mongoose from 'mongoose';
import CalendarSchema from '../../../models/Calendar';
// import Ingredient from '../../../models/Ingredient';
// import { syncIndexes } from '../../../models/Connections';
// import Connections from '../../../models/Connections';


export default async function recipeSwitch(req, res){
    dbConnect();
    const {method} = req;

    const Recipe = mongoose.models.Recipe || db.model("Recipe", RecipeSchema);

    switch(method) {
        case 'GET':
            try {
                const recipes = await Recipe.find({}).populate("ingredients", "_id name type")
                .exec();

                res.status(200).json({success: true, recipes})
            } catch (error) {
                console.log(error, 'what is the error here')
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
                // if (isConfirmed) {
                    const amount = req.body.ingredients.map(ingredient => ingredient.amount || '')
                    const data = {...req.body, password: null, date: Date.now(), signature: 'Chaz', amount}
                    const recipes = await Recipe.create(data)
    
                    res.status(201).json({success: true, recipes})
                // } 
                // else {
                //     res.status(400).json({success: false, message: 'Invalid'})
                // }
                //     } else {
                //         res.status(400).json({success: false, message: 'Invalid password'})
                //     }
                // }
            } catch (error) {
                console.log(error)
                res.status(400).json({success: false})
            }
        case 'DELETE':
            await deleteRecipe(req, res);
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }
}

    // Delete Recipe
    export const deleteRecipe = async (req, res) => {
        await dbConnect();
      
        const mongooseSession = await mongoose.startSession();
            
        try {
          mongooseSession.startTransaction();
    
          const {_id, signature} = req.query
      
          const deletedRecipe = await Recipe.findOneAndDelete({ _id });
          await Calendar.find({recipe_id: _id }).deleteMany()

    
          if (!deletedRecipe) {throw error}
      
          await mongooseSession.commitTransaction();
          mongooseSession.endSession();
      
          res.status(200).json({
            success: true,
            message: "Successful.",
          });
        } catch (err) {
          console.log("ERROR?", err.message);
      
          await mongooseSession.abortTransaction();
          mongooseSession.endSession();
      
          res.status(400).json({
            success: false,
            message: "Failed to delete item.",
          });
        }
      };

    //   export const getRecipeSSR = async (req) => {
    //   };
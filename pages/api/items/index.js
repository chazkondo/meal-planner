import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/Item';
// import Connections from '../../../models/Connections';
import mongoose from 'mongoose';

dbConnect();

export default async function itemSwitch(req, res){
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
                    const data = {...req.body, password: null, date: Date.now(), signature: 'Chaz'}
                    console.log(data, 'LETS SEE DATA ')
                    const items = await Item.create(data);
    
                    res.status(201).json({success: true, items})
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
            break;
        case 'DELETE':
            await deleteItem(req, res);
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }
}

export const deleteItem = async (req, res) => {
    console.log(req.query, 'delete item -  what is happening?')
    await dbConnect();
          
    try {

      const {_id, signature} = req.query
  
      const item = await Item.findOneAndDelete({ _id });
      console.log(item, 'what happens?')

      if (!item) {
        res.status(400).json({
            success: false,
            message: "Failed to delete item.",
          });
      } else {
        res.status(200).json({
            success: true,
            message: "Successful.",
          });
      }
    } catch (err) {
      console.log("ERROR?", err.message);

  
      res.status(400).json({
        success: false,
        message: "Failed to delete item.",
      });
    }
  };
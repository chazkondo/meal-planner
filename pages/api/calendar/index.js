import dbConnect from '../../../utils/dbConnect';
import Calendar from '../../../models/Calendar';
import mongoose from 'mongoose';

dbConnect();


export default async function calendarSwitch(req, res){
    const {method} = req;

    switch(method) {
        case 'GET':
            try {
                const calendarEntries = await Calendar.find({})

                res.status(200).json({success: true, calendarEntries})
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
                    const data = {...req.body, signature: 'test'}
                    console.log(data, 'da crap?')
                    const entry = await Calendar.create(data)
    
                    res.status(201).json({success: true, entry })
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
        case 'PUT':
            await updateUser(req, res);
            break;
        default:
            res.status(400).json({success: false, default: true})
            break;
    }

}

    //change organization
    export const updateUser = async (req, res) => {
        const db = await dbConnect();
      
        const mongooseSession = await mongoose.startSession();
            
        try {
          mongooseSession.startTransaction();
          console.log(req.body, 'what is being sent here?')

          const {_id, signature} = req.body
      
        //   const userArr = await Session.findOne(
        //     { accessToken: session.accessToken },
        //     "userId",
        //     { mongooseSession }
        //   );
      
      
          await Calendar.updateOne(
            { _id },
            {
              ...req.body
            },
            { mongooseSession }
          );
      
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
            message: "Failed to update user current organization.",
          });
        }
      };
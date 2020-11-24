const Info = require('../models/Info')
const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')
const vt = require('../middleware/verify-token')

// Given that we will add info using third party python app
// instead via the frontend, We cannot rely on having a jwt 
// being sent to the server, hence why we use our ultra secret 
// hash 06d80eb0c50b49a509b49f2424e8c805

async function addInfo(req, res){
    console.log("Body of the addInfo request")
    console.log(req.body)
    let token = req.headers['x-access-token']
    let valid = await verifyToken(token)
    let { 
        peopleEntering,
        storePin,
    } = req.body

    let store = await Auth.findOne({pin: storePin})

    const timestamp = Date.now()
    const d = new Date()
    const currentDay = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();

    if(valid && store){
        const oldPeopleInside = store.peopleInside
        let peopleInside = oldPeopleInside + peopleEntering
        const query = {pin: storePin}

        await Auth.findOneAndUpdate(query, {peopleInside, timestamp})
        const newInfo = new Info({peopleEntering, peopleInside, storePin, timestamp, currentDay})
        await newInfo.save()
        return res.status(201).send({msg: "Info added", info: newInfo})
    }else{
        return res.status(403).send({msg: "Unauthorized"})
    }
}

async function getInfo(req, res){
    console.log("Query params of the getInfo request")
    console.log(req.query)
    //let token = req.headers['x-access-token']
    //let valid = await verifyToken(token)
    let { pin } = req.query
    let store = await Auth.findOne({pin})
    
    if(store){
        const storeInfo = await Info.find({storePin: pin}).sort({timestamp: "desc"})
        console.log({msg: "Info", info: storeInfo})
        return res.status(200).send({msg: "Info", info: storeInfo})
    }else{
        return res.status(403).send({msg: "No info"})
    }
}

async function getLast7DaysInfo(req, res){
    let { pin } = req.query
    let date = new Date()
    let store = Auth.findOne({pin})

    if (store){
        let last7DaysInfo = await Info.find({ storePin: pin, currentDay: new Date(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())})
        console.log(last7DaysInfo)
        return res.status(200).send({msg: "Last 7 days info", info: last7DaysInfo})
    }else{
        return res.status(403).send({msg: "No info"})
    }
}

async function verifyToken(token){
    //console.log(token)
    if(!token){
        console.log({auth: false, message: 'No token provided'})
        return false;
    }else{
        let valid = await jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if(err){
                console.log({auth: false, message: 'Error validating token'})
                return false; 
            }else{
                console.log({auth: true, message: "Token validated!"})
                return true;
            }
        }).then(validated => {
            return validated
        })
        return valid
    }
}

module.exports = {
    addInfo,
    getInfo,
    getLast7DaysInfo
}
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
    // Current day
    const currentDay = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    // Other day
    //const currentDay = new Date("2020-12-23")

    if(valid && store){
        if (peopleEntering == 0){
            const peopleInside = peopleEntering
            const maxPeople = 0
            const query = {pin: storePin}
            await Auth.findOneAndUpdate(query, {peopleInside, timestamp, currentDay, maxPeople})
            return res.status(201).send({msg: "Updated peopleInside and maxPeople to 0"})
        }else{
            const oldPeopleInside = store.peopleInside
            let peopleInside = oldPeopleInside + peopleEntering
            const maxPeople = Math.max(store.maxPeople, peopleInside)
            
            const query = {pin: storePin}
    
            await Auth.findOneAndUpdate(query, {peopleInside, timestamp, currentDay, maxPeople})
            const newInfo = new Info({peopleEntering, peopleInside, storePin, timestamp, currentDay, maxPeople})
            await newInfo.save()
            return res.status(201).send({msg: "Info added", info: newInfo})
        }
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

async function getLast7DaysLogs(req, res){
    let { pin } = req.query
    let date = new Date()
    let store = Auth.findOne({pin})
    console.log('here')
    currentDay = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    console.log(date.getDate())
    if(date.getDate() >= 7){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-6)
    }else if(date.getDate() == 6){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
    }else if(date.getDate() == 5){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
    }else if(date.getDate() == 4){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-28'
    }else if(date.getDate() == 3){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-27'
    }else if(date.getDate() == 2){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-26'
    }else if(date.getDate() == 1 ){
        lastWeek = date.getFullYear()+'-'+(date.getMonth()+1)+'-25'
    }

    console.log(lastWeek)

    if (store){
        let last7DaysLogs = await Info.find({ storePin: pin, currentDay: { $gte: currentDay, $lte: lastWeek }}).sort({currentDay: 'desc'})
        console.log(last7DaysLogs)
        return res.status(200).send({msg: "Last 7 days info", info: last7DaysLogs})
    }else{
        return res.status(403).send({msg: "No info"})
    }
}

async function getLast7DaysMaxesData(req, res){
    let { pin } = req.query
    let date = new Date()
    let store = Auth.findOne({pin})
    console.log(date.getDate())
    if(date.getDate() >= 7){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-1)
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-2)
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-3)
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-4)
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-5)
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-6)
    }else if(date.getDate() == 6){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-06'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-05'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-04'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-03'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-02'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
    }else if(date.getDate() == 5){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-05'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-04'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-03'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-02'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
    }else if(date.getDate() == 4){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-04'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-03'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-02'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-28'
    }else if(date.getDate() == 3){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-03'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-02'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-28'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-27'
    }else if(date.getDate() == 2){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-02'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-28'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-27'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-26'
    }else if(date.getDate() == 1 ){
        day_1 = date.getFullYear()+'-'+(date.getMonth()+1)+'-01'
        day_2 = date.getFullYear()+'-'+(date.getMonth()+1)+'-30'
        day_3 = date.getFullYear()+'-'+(date.getMonth()+1)+'-29'
        day_4 = date.getFullYear()+'-'+(date.getMonth()+1)+'-28'
        day_5 = date.getFullYear()+'-'+(date.getMonth()+1)+'-27'
        day_6 = date.getFullYear()+'-'+(date.getMonth()+1)+'-26'
        day_7 = date.getFullYear()+'-'+(date.getMonth()+1)+'-25'
    }

    if (store){
        
        const day_1_info = await Info.findOne({ storePin: pin, currentDay: day_1}).sort({maxPeople: 'desc'})
        const day_2_info = await Info.findOne({ storePin: pin, currentDay: day_2}).sort({maxPeople: 'desc'})
        const day_3_info = await Info.findOne({ storePin: pin, currentDay: day_3}).sort({maxPeople: 'desc'})
        const day_4_info = await Info.findOne({ storePin: pin, currentDay: day_4}).sort({maxPeople: 'desc'})
        const day_5_info = await Info.findOne({ storePin: pin, currentDay: day_5}).sort({maxPeople: 'desc'})
        const day_6_info = await Info.findOne({ storePin: pin, currentDay: day_6}).sort({maxPeople: 'desc'})
        const day_7_info = await Info.findOne({ storePin: pin, currentDay: day_7}).sort({maxPeople: 'desc'})

        last7DaysMaxesData = {
            day_1: day_1_info,
            day_2: day_2_info,
            day_3: day_3_info,
            day_4: day_4_info,
            day_5: day_5_info,
            day_6: day_6_info,
            day_7: day_7_info
        }

        return res.status(200).send({msg: "Last 7 days maxes", info: last7DaysMaxesData})
    }else{
        return res.status(403).send({msg: "No info available"})
    }
}

async function getLogsInDatesIntervals(req, res){
    let { pin } = req.query
    let { startingDate, endingDate } = req.body
    console.log(req.body)

    let store = await Auth.findOne({pin})

    if (store){
        let data = await Info.find({storePin: pin, currentDay: {$gte: new Date(startingDate), $lte: new Date(endingDate)}}).sort({currentDay: 'desc'})
        return res.status(200).send({msg: "Data found!", data: data})
    }else{
        return res.status(403).send({msg: "No info available"}) 
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
    getLast7DaysLogs,
    getLast7DaysMaxesData,
    getLogsInDatesIntervals,
}
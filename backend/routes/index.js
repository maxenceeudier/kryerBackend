var express = require("express");
var router = express.Router();

//format date
function formatDate (date){
  return ('0'+date.getDate()).slice(-2)+'/'+ ('0'+parseInt(date.getMonth()+1)).slice(-2)+'/'+date.getFullYear();
};

//import des modeles
var userModel = require("../modules/users");
var messageModel = require("../modules/messages");
var missionModel = require("../modules/missions");
var deliveryModel = require("../modules/deliveries");

/* GET home page. */
router.get("/", async function (req, res, next) {
  var user = await deliveryModel
    .findById("61ade704aa1d49805ebbd627")
    .populate("expeditor_id")
    .exec();

  console.log(user.expeditor_id);

  res.render("index", { title: "Express" });
});

router.post("/saveMission", async function (req, res, next) {
  let newMission = new missionModel({
    date_delivery: req.body.deliveryDate,
    place_delivery: req.body.deliveryPlace,
    date_receipt: req.body.recuperationDate,
    place_receipt: req.body.recuperationPlace,
    pricePerKg: req.body.pricePerKg,
    departure_journey: req.body.departure,
    arrival_journey: req.body.arrival,
    transport_capacity_total: req.body.weight,
    transport_capacity_rest: req.body.weight,
    date_journey: req.body.dateJourney,
  });

  await newMission.save();

  res.json({ result: true });
});

router.post('/searchKryer', async function(req,res,next){

  var missionList = await missionModel.find({departure_journey:req.body.departure, arrival_journey:req.body.arrival});
  
  //missionList = missionList.filter(e => e.date_journey >= req.body.date);

  //filtre sur le poid du colis
  missionList = missionList.filter(e=> e.transport_capacity_rest >= req.body.weight)
  console.log(missionList);

  // je recupere seulement les informations qui m'interessent pour les envoyer dans le front
  kryerList = [];
  missionList.map(function(e){
    kryerList.push({
      departure:e.departure_journey,
      arrival:e.arrival_journey,
      date:e.date_journey,
      price: parseInt(e.pricePerKg) * parseInt(req.body.weight),
      id:e.id,
      date_delivery:e.date_delivery,
      place_delivery:e.place_delivery,
      date_receipt:e.date_receipt,
      place_receipt:e.place_receipt
    })
  });

  console.log(kryerList)

  
  
  var result = false;
  if(kryerList){
    result = kryerList;
  }

  res.json(result)
});

router.get('/getMission', async function(req, res, next){
  //var missions = await deliveryModel.findById("61ade704aa1d49805ebbd627");
  var missions = await missionModel.find();

  console.log(missions);
  var result = false;
  if(missions){
    result = missions;
  }
  res.json(result);

});


module.exports = router;

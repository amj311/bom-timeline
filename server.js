const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'))
app.use(cors());

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb+srv://amj311:be13strong51@cluster0-u6luc.mongodb.net/immerse', {
  useNewUrlParser: true
});


/***************************
 *        - ARCS -         * 
 **************************/

// Create a scheme for arcs in the timeline.
const arcSchema = new mongoose.Schema({
  name: String,
  color: {
    type: String,
    default: '#bbb',
  },
  note: String,
  isMainStory: {
    type: Boolean,
    default: false
  },
  drawLines: {
    type: Boolean,
    default: true
  },
  lineAlgorithm: String,
  
});

// Create a model for arcs in the timeline.
const Arc = mongoose.model('Arc', arcSchema);



// Get a list of all of the items in the timeline.
app.get('/api/arcs', async(req, res) => {
  try {
    let items = await Arc.find();
    res.send(items);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Create a new arc in the timeline
app.post('/api/arcs', async(req, res) => {
  const arc = new Arc(req.body);
  try {
    console.log("Post Arc");
    console.log(arc);
    await arc.save();
    res.send(arc);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Update an arc
app.put('/api/arcs/:id', async(req, res) => {
  try {
    console.log("Edit Arc");
    var item = await Arc.findByIdAndUpdate({ _id: req.body._id }, req.body);
    console.log(item);
    res.send(item)
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Delete an arc
app.delete('/api/arcs/:id', async(req, res) => {
  try {
    // console.log("Made it into delete");
    let result = await Arc.deleteOne({ _id: req.params.id });
    res.send(result);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});






/***********************************
 *        - EVENTS/ITEMS -         * 
 * ********************************/

// Create a scheme for items in the timeline: a title and a path to an image.
const timelineObjectSchema = new mongoose.Schema({
  name: String,
  customIcon: String,
  day: Number,
  color: String,
  month: Number,
  year: Number,
  pos: Number,
  img: String,
  imgCred: String,
  note: String,
  type: String,
  eventType: {
    type: String,
    default: 'noraml',
  },
  title: String,
  body: String,
  loc: String,
  order: String,
  arcId: String,
  lists: {
    type: [],
    default: [],
    required: true,
  },
  prophecies: {
    type: [],
    default: [],
    required: true,
  },
  scriptureLink: {
    type: String,
    default: undefined,
  },
  width: {
    type: Number,
    default: 100,
  },
  offset: {
    type: Number,
    default: -50,
  },
});

// Create a model for items in the timeline.
const TimeObject = mongoose.model('TimeObject', timelineObjectSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async(req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the timeline: takes a title and a path to an image.
app.post('/api/items', async(req, res) => {
  const item = new TimeObject(req.body);
  try {
    console.log("Post TimeObject");
    console.log(item);
    await item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the timeline.
app.get('/api/items', async(req, res) => {
  try {
    let items = await TimeObject.find();
    res.send(items);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async(req, res) => {
  try {
    // console.log("Made it into delete");
    let result = await TimeObject.deleteOne({ _id: req.params.id });
    res.send(result);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async(req, res) => {
  try {
    console.log("Edit TimeObject: ",req.body);
    var item = await TimeObject.findByIdAndUpdate({ _id: req.params.id }, req.body);
    console.log("saved object: ", item);
    res.send(item)
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

let port = process.env.PORT || 4202;
app.listen(port, () => console.log('Server listening on port '+port));

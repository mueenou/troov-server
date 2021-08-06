const router = require("express").Router();
const Object = require("../model/object");
const { upload } = require('../helpers/filehelper');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// VALIDATION
const Joi = require("joi");
const verify = require("./verifyToken");

router.post("/user/object", verify, async (req, res) => {
  const { name, description, lost_city, lost_dpt } = req.body;
  // Create an object
  const object = new Object({
    name,
    description,
    lost_city,
    lost_dpt,
    author: req.user._id,
    images: []
  });

  try {
    const savedObject = await object.save();
    res.status(200).send({ object: object._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const foundObjects = await Object.find();
    console.log(foundObjects);
    res.status(200).send(foundObjects);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/user/object", verify, async (req, res) => {
  try {
    const foundObjects = await Object.find({ author: req.user._id });
    console.log(foundObjects);
    res.status(200).send(foundObjects);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Mofify an object
router.put("/user/object/update/:objectId", verify, async (req, res) => {
  try {
    const foundObject = await Object.findOne({ _id: req.params.objectId });
    if (req.body.name) foundObject.name = req.body.name;
    if (req.body.description) foundObject.description = req.body.description;
    if (req.body.lost_city) foundObject.lost_city = req.body.lost_city;
    if (req.body.lost_dpt) foundObject.lost_dpt = req.body.lost_dpt;
    await foundObject.save();
    res.status(200).send(foundObject);
  } catch (error) {
    res.status(404).send();
  }
});

// Delete an object
router.delete("/user/object/delete/:objectId", verify, async (req, res) => {
  try {
    await Object.deleteOne({ _id: req.params.objectId });
    res.status(200).send("Object deleted");
  } catch (error) {
    res.status(404).send("object not deleted");
  }
});

router.put("/user/object/images/add/:objectId", upload.array('files'), async (req, res) => {
  try{
      let filesArray = [];
      console.log(req.files);
      req.files.forEach(element => {
          const file = {
              fileName: element.originalname,
              filePath: element.path,
              fileType: element.mimetype,
              fileSize: fileSizeFormatter(element.size, 2)
          }
          filesArray.push(file);
      });
      const foundObject = await Object.findOneAndUpdate({
        _id: req.params.objectId
      }, {
        images: filesArray
      })
      await foundObject.save();
      res.status(201).send('Images Uploaded Successfully');
  }catch(error) {
      res.status(400).send(error.message);
  }
})

const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
      return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = router;

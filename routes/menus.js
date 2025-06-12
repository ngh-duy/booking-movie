var express = require('express');
var router = express.Router();
let menuSchema = require('../schemas/menu')
let slugify = require('slugify')


/* GET users listing. */
router.get('/', async function (req, res, next) {
  let allmenus = await menuSchema.find({});
  let parent = allmenus.filter(m => !m.parent);
  let parentResult = [];
  for (const menu of parent) {
    let children = await menuSchema.find({
      parent: menu._id
    });
    let mapedChildren = children.map(c => ({
      text: c.text,
      url: c.url
    }))
    parentResult.push({
      text:menu.text,
      url:menu.url,
      children: mapedChildren
    })
  }
  res.send(parentResult)
});
router.post('/', async function (req, res, next) {
  try {
    let menuObj = {
      text: req.body.text,
      url: `/${slugify(req.body.text, { lower: true })}`
    }
    if (req.body.parent) {
      let parent = await menuSchema.findOne({
        text: req.body.parent
      })
      console.log(parent);
      menuObj.parent = parent._id;
    }
    let newMenu = new menuSchema(menuObj)
    await newMenu.save();
    res.send(newMenu)
  } catch (error) {

  }
});


module.exports = router;

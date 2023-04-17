'use strict';

const express = require('express');
const dataModules = require('../auth/models');
const permissions = require('../auth/middleware/acl');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', permissions('read'), handleGetAll);
router.get('/:model/:id', permissions('read'), handleGetOne);
router.post('/:model', permissions('create'), handleCreate);
router.put('/:model/:id', permissions('update'), handleUpdate);
router.delete('/:model/:id', permissions('delete'), handleDelete);
router.get('/users/:id/:model', permissions('update'), handleFosterCats);

async function handleGetAll(req, res) {
  let allRecords = await req.model.read();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.read(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

async function handleFosterCats(req, res) {
  let userId = req.params.id;
  let foster_cats = await req.model.read(null, {
    where: {
      user_Id: userId
    }
  });
  res.status(200).json(foster_cats);
}


module.exports = router;
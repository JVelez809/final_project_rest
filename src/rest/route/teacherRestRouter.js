var express = require('express');

var teacherModel = require('../model/teacherModel');
var teacherRestController = require('../controller/teacherRestController')(teacherModel);

var teacherRestRouter = express.Router();

teacherRestRouter.route('')
    .get(teacherRestController.find)
    .post(teacherRestController.save)
    .delete(teacherRestController.findByIdInBodyThenRemove);

teacherRestRouter.route('/:id')
    .get(teacherRestController.findById)
    .put(teacherRestController.findByIdUpdateFullyThenSave)
    .patch(teacherRestController.findByIdUpdatePartiallyThenSave)
    .delete(teacherRestController.findByIdThenRemove);

teacherRestRouter.route('/echo/:msg')
    .get(teacherRestController.echoMsg)

module.exports = teacherRestRouter;
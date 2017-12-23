var mongoose = require('mongoose');

var teacherRestController = function(teacherModel) {
    /**
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg);
    };

    /**
     * @param {*} req Request
     * @param {*} res Response
     */
    var find = function(req, res) {
        teacherModel.find(function(error, teacher) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teacher);
            }
        });
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(teacher);
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of GET request. req.params.id:" + req.params.id);
        }
    };
    /**
     * @param {*} request 
     * @param {*} response 
     */
    var save = function(request, response) {
        var teacher = new teacherModel(request.body);
        console.log("--> LOOK request: %s", request); // JSON.stringify(request)
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log("--> LOOK request.body: %s", request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201); // 201 means created
                response.send(teacher);
            }
        });
    };

    /**
    * Fulfills PUT REST requests. This is NOT partial update, but full update of teacher record in mongodb for id in the url 
    * 1) Find the teacher from mongodb by id provided in the url
    * 2) Set teacher fetched from mongodb to have values of all the attributes expected to be in the body of request
    * 3) Save the replaced teacher back to mongodb
    * http://localhost:9016/teachers/:id                       PUT
    * http://localhost:9016/teachers/5a23e035decd2b6770ab4890  PUT
    * 
      curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update",   "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false}' http://localhost:9016/teachers/5a23f72a1fb00a38f0a814a9
      curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update_2", "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"2017-12-03T12:39:06.446Z"}' http://localhost:9016/teachers/5a23f72a1fb00a38f0a814a9
      curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update_2", "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:9016/teachers/5a23f72a1fb00a38f0a814a9
      curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 3, "name":"ilker_3_update",   "lastname":"kiris_3", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:9016/teachers/5a2f2505c96a552334fdc762
    * 
    * In postman, select PUT as method, click Body, click raw, select "JSON(application/json)" pulldown,
    * in url enter   http://localhost:9016/teachers/5a23e72b0a47f03f787cd618
    * in "Pre-request Script" tab of postman, enter
    *   postman.setGlobalVariable("myCurrentDate", new Date().toISOString());
    * in "Body" tab of postman, enter
    * {
    *   "teacherId": 4,
    *   "name": "ilker_4_update",
    *   "lastname": "kiris_4",
    *   "grade": "FreshMan ",
    *   "age": 204,
    *   "isFullTime": false,
    *   "updatedOn": "{{myCurrentDate}}"
    * }
    * @param {*} req 
    * @param {*} res 
    */
    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Student for id:" + req.params.id);
                } else {
                    console.log("req.body.updatedOn: %s", req.body.updatedOn);
                    teahcer.teacherId = req.body.studentId;
                    teacher.name = req.body.name;
                    teacher.lastname = req.body.lastname;
                    teacher.title = req.body.grade;
                    teacher.age = req.body.age;
                    teacher.isFullTime = req.body.isFullTime;
                    teacher.updatedOn = req.body.updatedOn;

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created
                            res.send(teacher);
                        }
                    });
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PUT request. req.params.id:" + req.params.id);
        }
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Student for id:" + req.params.id);
                } else {
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    for (var attrName in req.body) {
                        teacher[attrName] = req.body[attrName];
                    }

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created - in this case means updated
                            res.send(teacher);
                        }
                    })
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PATCH request. req.params.id:" + req.params.id);
        }
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                teacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404);
                        res.send("Not found Teacher for id:" + req.params.id);
                    } else {
                        teacher.remove(function(error) {
                            if (error) {
                                res.status(500);
                                res.send("Remove failed");
                            } else {
                                res.status(204);
                                res.send(teacher);
                            }
                        })
                    }
                });
            } else {
                res.status(400);
                res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request. req.params.id:" + req.params.id);
            }

        } catch (e) {
            res.status(500);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request may be not a valid ObjectId value. req.params.id:" + req.params.id);
        }
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            teacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means "not found""
                    res.send("Not found Teacher for id:" + req.body._id);
                } else {
                    console.log("LAGA%sLUGA", error);
                    teacher.remove(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Remove failed");
                        } else {
                            res.status(204); // 204 means deleted ("No Content")
                            res.send(teacher);
                        }
                    })
                }
            });

        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id in body of DELETE request");
        }
    };

    // expose public functions via returned object below from this module
    return {
        echoMsg: echoMsg,
        find: find,
        findById: findById,
        save: save,
        findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
        findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
        findByIdThenRemove: findByIdThenRemove,
        findByIdInBodyThenRemove: findByIdInBodyThenRemove
    }
};

module.exports = teacherRestController;
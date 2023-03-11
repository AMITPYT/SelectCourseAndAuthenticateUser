const express = require("express");
const router = express.Router();
const Coures = require("../../Models/courese");
const { validationResult } = require("express-validator");
const fetchuser = require('../../middleware/fetchuser');

router.post( "/api/coures/add",fetchuser,async (req, res) => {
    try {
      const { courseName, creaditHour, year, course_code, course_info, instructorName } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if(courseName == "" || creaditHour == "" || year == "" || course_code == "" || course_info == "" || instructorName == ""){
       return  res.json({msg: "Empty Field not allowed"})
      }
      const coures = new  Coures ({
        courseName,
        creaditHour,
        year,
        course_code,
        course_info,
        instructorName,
        user: req.user.id,
      });
      const savedNote = await coures.save();

      res.json({"Success": "Courese Added Successfully",savedNote});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get('/api/coures/courses', fetchuser, async (req, res) => {
    try {
        const getallcourese = await  Coures .find({ user: req.user.id });
        res.json(getallcourese)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/api/coures/updatecourse/:id', fetchuser, async (req, res) => {
    try {

        const { courseName, creaditHour, year, course_code, course_info, instructorName } = req.body;
        // Create a new note Object
        const newCourse = {};
        if (courseName) {
            newCourse.courseName = courseName;
        }
        if (creaditHour) {
            newCourse.creaditHour = creaditHour;
        }
        if (year) {
            newCourse.year = year;
        }
        if (course_code) {
            newCourse.course_code = course_code;
        }
        if (course_info) {
            newCourse.course_info = course_info;
        }
        if (instructorName) {
            newCourse.instructorName = instructorName;
        }
        // Find the note to be Updated and update it

        let course = await Coures.findById(req.params.id);
        if (!course) {
            return res.status(404).send('Not found');
        }
        // note.user.toString is given the user id 
        if (course.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        course = await Coures.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true })
        res.json({ course });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


})

// ROUTE 4 : Delete the existing Note using: DELETE "/api/notes/deletenote". Login required 
router.delete('/api/coures/deletecoures/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let course = await Coures.findById(req.params.id);
        if (!course) {
            return res.status(404).send('Not found');
        }
        // Allow deletion only if the user own this Notic
        if (course.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        course = await Coures.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Courese has been deleted", course: course });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

module.exports = router;
const express = require("express");
const router = express.Router();
const Role = require("../../Models/roles");
const { validationResult } = require("express-validator");
const fetchuser = require('../../middleware/fetchuser');

router.post( "/api/coures/role",fetchuser,async (req, res) => {
    try {
      const {role } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const roles = new Role({
        role,
        user: req.user.id,
      });
      const savedRole = await roles.save();

      res.json({"Success": "Role Added Successfully",savedRole});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get('/api/coures/getrole', fetchuser, async (req, res) => {
    try {
        const getrole = await  Role.find({ user: req.user.id });
        res.json(getrole)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/api/coures/updaterole/:id', fetchuser, async (req, res) => {
    try {

        const {role} = req.body;
        // Create a new note Object
        const newrole = {};
        if (role) {
           newrole.role = role;
        }

        let roles = await Role.findById(req.params.id);
        if (!roles) {
            return res.status(404).send('Not found');
        }
        // note.user.toString is given the user id 
        if (roles.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        roles = await Role.findByIdAndUpdate(req.params.id, { $set: newrole }, { new: true })
        res.json({"Success": "Role has been updated", roles });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


})

// ROUTE 4 : Delete the existing Note using: DELETE "/api/notes/deletenote". Login required 
router.delete('/api/coures/deleterole/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).send('Not found');
        }
        // Allow deletion only if the user own this Notic
        if (role.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        role = await Role.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Role has been deleted", role: role });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router;
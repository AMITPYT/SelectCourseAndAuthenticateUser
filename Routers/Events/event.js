const express = require("express");
const router = express.Router();
const Event = require("../../Models/event");
const { validationResult } = require("express-validator");
const fetchuser = require('../../middleware/fetchuser');

router.post( "/api/coures/event",fetchuser,async (req, res) => {
    try {
      const {eventType, eventName, eventDate } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const events = new Event({
        eventType,
        eventName,
        eventDate,
        user: req.user.id,
      });
      const savedEvent = await events.save();

      res.json({"Success": "Events Added Successfully",savedEvent});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get('/api/coures/getevent', fetchuser, async (req, res) => {
    try {
        const getevent = await Event.find({ user: req.user.id });
        res.json(getevent)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/api/coures/updateevent/:id', fetchuser, async (req, res) => {
    try {

        const {eventType, eventName, eventDate} = req.body;
        // Create a new note Object
        const newevent = {};
        if (eventType) {
            newevent.eventType = eventType;
        }
        if (eventName) {
            newevent.eventName = eventName;
        }
        if (eventDate) {
            newevent.eventDate = eventDate;
        }

        let events = await Event.findById(req.params.id);
        if (!events) {
            return res.status(404).send('Not found');
        }
        // note.user.toString is given the user id 
        if (events.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        events = await Event.findByIdAndUpdate(req.params.id, { $set: newevent }, { new: true })
        res.json({"Success": "Event has been updated", events });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


})

// ROUTE 4 : Delete the existing Note using: DELETE "/api/notes/deletenote". Login required 
router.delete('/api/coures/deleteevent/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Not found');
        }
        // Allow deletion only if the user own this Notic
        if (event.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        event = await Event.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Event has been deleted", event: event });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router;
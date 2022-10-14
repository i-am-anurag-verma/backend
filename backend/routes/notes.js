const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route 1: Get All the notes using: GET "/api/notes/fetchallnotes" . Doesn't require Auth

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // console.log("req ===>", req.user)
        const notes = await Notes.find({ user: req.user.id })
        // console.log("user==>", notes);
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

//Route 2: Add a new Note using: POST "/api/notes/addnote" . Doesn't require Auth
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be at least 5 character").isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

//Route 3: Update an existing Note using: PUT "/api/notes/updatenote" . Doesn't require Auth

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create anewNote object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }

})

//Route 4: Delete an existing Note using: DELETE "/api/notes/deletenote" . Doesn't require Auth

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

module.exports = router;
const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const Note = require("../models/Note");

const { body, validationResult } = require("express-validator");

//ROUTE 1: Get All the Notes using: Get "/api/note/fetchallnotes" login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
  res.json(notes);
    } catch (error) {
        console.log.error(error.message);
        res.status(500).send("Internal Server Error");
      }
  
});

//ROUTE 2: Get All the Notes using: POST "/api/note/addnote" login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({min:3}),
  ],
  async (req, res) => {
    try {
        const {title,description,tag}=req.body;
        //If there are errors,return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const note = new Note({
            title,description,tag,user:req.user.id
        })
        const savedNote= await note.save();
    
        res.json(savedNote);
    } catch (error) {
        //console.log.error(error.message);
        console.log(error.message);
        res.status(500).send("Some Error occured");
      }
   
  }
);

//ROUTE 3: Update an existing Note using: PUT "/api/note/updatenote". Login required
router.put("/updatenote/:id",fetchUser, async (req,res)=>{
  const {title,description,tag}=req.body;
  //Create a newnote object
  const newNote={};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};

  //Find the note to be updated and update it
  let note=await Note.findById(req.params.id);
  if(!note){
    return res.status(404).send("Not Found")
  }
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not allowed");
  }

  note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note});
})

//Route 4: Delete an existing Note using: DELETE "/api/note/deletenote". Login required
router.delete("/deletenote/:id",fetchUser,async (req,res)=>{
  try {
    //Find the note to be delete and delete it
    let note=await Note.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")}

    //Allow deletion only if user owns this note
    if(note.user.toString() !==req.user.id){
      return res.status(401).send("Not allowed");
    }

    note= await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
})

module.exports = router;

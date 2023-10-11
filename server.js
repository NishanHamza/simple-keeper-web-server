import express from "express";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import cors from "cors";

mongoose.set("strictQuery", true);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/keeperApp", {
  useNewUrlParser: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

app.post("/submit", (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });
  note.save(function (err) {
    if (err) return handleError(err);
    // saved!
  });
});

app.get("/data", (req, res) => {
  Note.find({}, (err, foundNotes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(foundNotes);
    }
  });
});

app.post("/delete", (req, res) => {
  const noteId = req.body.noteId;
  Note.deleteOne({ _id: noteId }, (err, result) => {
    if (err) {
      console.log(err);
    }else{
      console.log("Succesfully Deleted Data of ID=" + noteId);
    }
  });
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});

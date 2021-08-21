const express = require('express')
const path = require('path')
const hbs = require('hbs')
const app = express()

const { insertStudent, updateStudent, getStudentById, deleteStudent
    , getDB, } = require('./databaseHandler');
app.set('views', path.join(__dirname+ '/views'))
app.set('view engine', 'hbs')


app.use(express.static('views'))
app.use(express.urlencoded());
app.get('/edit', async (req, res) => {
    const id = req.query.id;

    const s = await getStudentById(id);
    res.render("edit", { student: s });
})
app.post('/update', async (req, res) => {
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtTuoi;
    const id = req.body.txtId;

    updateStudent(id, nameInput, tuoiInput);
    res.redirect("/");
})

app.post('/insert', async (req, res) => {
    console.log(req.body)
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtTuoi;
    const pictureInput = req.body.txtPicture;
    if(nameInput.length <4){
        res.render("index",{errorMsg:'Ten nho hon 4 ky tu'})
        return;
    }

    const newStudent = { name: nameInput, tuoi: tuoiInput, picture: pictureInput }

    insertStudent(newStudent);
    res.redirect("/");
})
app.get('/delete', async (req, res) => {
    const id = req.query.id;

    await deleteStudent(id);
    res.redirect("/");
})

app.get('/', async (req, res) => {
    const dbo = await getDB();
    const allStudents = await dbo.collection("students").find({}).toArray();
    res.render('index', { data: allStudents })
})

app.post('/search', async (req, res) => {
    console.log(req.body)
    const searchInput = req.body.txtSearch;
    const dbo = await getDB()
    const allStudents = await dbo.collection("students").find({ name: searchInput }).toArray();

    res.render('index', { data: allStudents })
})

const PORT = process.env.PORT || 5001;
app.listen(PORT)
console.log("app is running ", PORT)
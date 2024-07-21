



const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"

const Employe=require("../models/employes")


  
router.post("/add_employe",isLoggedIn, async (req, res) => {
    try {
        // Function to check if an email already exists

        // Create a new employe instance
        const employe = new Employe({
            name: req.body.name,
            email: req.body.email,
            status: req.body.status,

            password: req.body.password,
                   
            
        });

        // Save the new employe to the database
        await employe.save();

        // Set a success message in the session and redirect
        req.session.message = {
            type: "success",
            message: "employe added successfully!"
          };
        res.redirect("/employes");

    } catch (err) {
        // Send an error response if something goes wrong
        res.json({ message: err.message, type: "danger" });
    }
});
  







router.get("/employes", isLoggedIn,async (req, res) => {
    try {
        const employes = await Employe.find().exec();

        res.render("backend/employes", {
            title: "employe",
            employes,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/add_employe", isLoggedIn,async(req, res) => {


    res.render("backend/add_employe",{
        title:"employe Page",
    });
});







router.get('/edit-employe/:id',isLoggedIn, async function (req, res) {
    try {
        const employe = await Employe.findById(req.params.id).exec();
        if (!employe) {
            return res.redirect('/employe/pages/');
        }

        res.render('backend/edit_employe', {
            name: employe.name,
            password: employe.password,
            email: employe.email,
            status: employe.status,
            id: employe._id,
            employe:employe,

            title:"edit_employe",

            message: "employe updated successfully",

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-employe/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;

     var  { name, password, email, status } = req.body;

    try {
        let result = await Employe.findByIdAndUpdate(id, {
            name: name,
            email: email,
            password:password,
            status:status


        });

        if (!result) {
            res.json({ message: "employe not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "employe updated successfully"
            };
                res.redirect('/employes');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-employe/:id', isLoggedIn,async function (req, res) {
    try {
        await Employe.findByIdAndDelete(req.params.id);
        const employes = await Employe.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.employes = employes;
     {
            req.session.message = {
                type: "success",
                message: "employe Delete successfully"
            };


            res.redirect("/employes");
        }
    } catch (err) {
        console.error(err);
    }
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
  }
  
  
  
module.exports = router;

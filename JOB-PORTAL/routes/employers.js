const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const Employer=require("../models/employers")




router.post("/add_employer", isLoggedIn,async (req, res) => {
    try {
        const employers = new Employer({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status

        });

        await employers.save();

        req.session.message = {
            type: "success",
            message: "employer added successfully"
        };
        res.redirect('/employers');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

















router.get("/employers", isLoggedIn,async (req, res) => {
    try {
        const employers = await Employer.find().exec();
        res.render("backend/employers", {
            title: "Employers",
            employers: employers,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});




router.get("/add_employer", isLoggedIn,(req, res) => {
    res.render("backend/add_employer",{
        title:"employers Page",

    });
});




router.get('/edit-employer/:id', isLoggedIn,async function (req, res) {
    try {
        const employer = await Employer.findById(req.params.id).exec();
        if (!employer) {
            return res.redirect('/employer/pages/');
        }

        res.render('backend/edit_employer', {
            name: employer.name,
            email:employer.email,
            password:employer.password,
            status:employer.status,
            id: employer._id,
            employer: employer,
            title:"edit_employer",

            message: "employer updated successfully"

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-employer/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;
     var  { name,email,status,password  } = req.body;

    try {
        let result = await Employer.findByIdAndUpdate(id, {
            name: name,
            email:email,
            status:status,
            password:password
        });

        if (!result) {
            res.json({ message: "Categorie not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Countrie updated successfully"
            };
                res.redirect('/employers');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-employer/:id',isLoggedIn, async function (req, res) {
    try {
        await Employer.findByIdAndDelete(req.params.id);
        const employers = await Employer.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.employers = employers;
     {
            req.session.message = {
                type: "success",
                message: "City Delete successfully"
            };


            res.redirect("/employers");
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

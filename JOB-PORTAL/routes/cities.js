const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const Citie=require("../models/cities")
const Countrie=require("../models/countries")




router.post("/add_citie", isLoggedIn,async (req, res) => {
    try {
        const cities = new Citie({
            name: req.body.name,
            countrie_id: req.body.countrie_id,

        });

        await cities.save();

        req.session.message = {
            type: "success",
            message: "city added successfully"
        };
        res.redirect('/cities');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

















router.get("/cities", isLoggedIn,async (req, res) => {
    try {
        const cities = await Citie.find().populate('countrie_id').exec();
        res.render("backend/cities", {
            title: "cities",
            cities: cities,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});




router.get("/add_citie",isLoggedIn,async (req, res) => {
    const countries = await Countrie.find({});

    res.render("backend/add_citie",{
        title:"cities Page",
        countries
    });
});




router.get('/edit-citie/:id', isLoggedIn,async function (req, res) {
    try {
        const citie = await Citie.findById(req.params.id).exec();
        const countries = await Countrie.find({});

        if (!citie) {
            return res.redirect('/citie/pages/');
        }

        res.render('backend/edit_citie', {
            name: citie.name,
            id: citie._id,
            citie: citie,
            title:"edit_citie",

            message: "Citie updated successfully",
            countries
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-citie/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;
     var  { name,  } = req.body;

    try {
        let result = await Citie.findByIdAndUpdate(id, {
            name: name,
            countrie_id: req.body.countrie_id,

        });

        if (!result) {
            res.json({ message: "Categorie not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Countrie updated successfully"
            };
                res.redirect('/cities');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-citie/:id', isLoggedIn,async function (req, res) {
    try {
        await Citie.findByIdAndDelete(req.params.id);
        const cities = await Citie.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.cities = cities;
     {
            req.session.message = {
                type: "success",
                message: "City Delete successfully"
            };


            res.redirect("/cities");
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

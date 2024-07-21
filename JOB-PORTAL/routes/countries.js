const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const Countrie=require("../models/countries")




router.post("/add_countrie", isLoggedIn,async (req, res) => {
    try {
        const countries = new Countrie({
            name: req.body.name,

        });

        await countries.save();

        req.session.message = {
            type: "success",
            message: "countrie added successfully"
        };
        res.redirect('/countries');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

















router.get("/countries", isLoggedIn,async (req, res) => {
    try {
        const countries = await Countrie.find().exec();
        res.render("backend/countries", {
            title: "categorie",
            countries: countries,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});




router.get("/add_countrie", isLoggedIn,(req, res) => {
    res.render("backend/add_countrie",{
        title:"countries Page",

    });
});




router.get('/edit-countrie/:id', isLoggedIn,async function (req, res) {
    try {
        const countrie = await Countrie.findById(req.params.id).exec();
        if (!countrie) {
            return res.redirect('/countrie/pages/');
        }

        res.render('backend/edit_countrie', {
            name: countrie.name,
            id: countrie._id,
            countrie: countrie,
            title:"edit_categorie",

            message: "Categorie updated successfully"

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-countrie/:id', async function (req, res) {
    var id = req.params.id;
     var  { name,  } = req.body;

    try {
        let result = await Countrie.findByIdAndUpdate(id, {
            name: name,
        });

        if (!result) {
            res.json({ message: "Categorie not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Countrie updated successfully"
            };
                res.redirect('/countries');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-countrie/:id', isLoggedIn,async function (req, res) {
    try {
        await Countrie.findByIdAndDelete(req.params.id);
        const countries = await Countrie.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.categories = countries;
     {
            req.session.message = {
                type: "success",
                message: "Countries Delete successfully"
            };


            res.redirect("/countries");
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

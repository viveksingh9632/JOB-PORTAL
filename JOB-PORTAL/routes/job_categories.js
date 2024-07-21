const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const Categorie=require("../models/categories")




router.post("/add_categorie", isLoggedIn,async (req, res) => {
    try {
        const categories = new Categorie({
            category: req.body.category,
            desc: req.body.desc,

            status: req.body.status

        });

        await categories.save();

        req.session.message = {
            type: "success",
            message: "Category added successfully"
        };
        res.redirect('/categories');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

















router.get("/categories", isLoggedIn,async (req, res) => {
    try {
        const categories = await Categorie.find().exec();
        res.render("backend/categories", {
            title: "categorie",
            categories: categories,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});




router.get("/add_categorie", isLoggedIn,(req, res) => {
    res.render("backend/add_categorie",{
        title:"job_categories Page",

    });
});




router.get('/edit-categorie/:id',isLoggedIn, async function (req, res) {
    try {
        const categorie = await Categorie.findById(req.params.id).exec();
        if (!categorie) {
            return res.redirect('/categorie/pages/');
        }

        res.render('backend/edit_categorie', {
            category: categorie.category,
            desc: categorie.desc,

            status: categorie.status,
            id: categorie._id,
            categorie:categorie,
            title:"edit_categorie",

            message: "Categorie updated successfully"

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-categorie/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;
     var  { category, desc, status, } = req.body;

    try {
        let result = await Categorie.findByIdAndUpdate(id, {
            category: category,
            desc:desc,
            status:status,
        });

        if (!result) {
            res.json({ message: "Categorie not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Categorie updated successfully"
            };
                res.redirect('/categories');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-categorie/:id', isLoggedIn,async function (req, res) {
    try {
        await Categorie.findByIdAndDelete(req.params.id);
        const categories = await Categorie.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.categories = categories;
     {
            req.session.message = {
                type: "success",
                message: "Categorie Delete successfully"
            };


            res.redirect("/categories");
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

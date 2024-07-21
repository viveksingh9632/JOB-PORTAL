 const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const Job=require("../models/jobs")
const Employer=require("../models/employers")
const Citie=require("../models/cities")

const Categorie=require("../models/categories")


router.post("/add_job", isLoggedIn,async (req, res) => {
    try {
        const jobs = new Job({
            categorie_id: req.body.categorie_id,
            employer_id: req.body.employer_id,
            citie_id: req.body.citie_id,

            title: req.body.title,
            desc: req.body.desc,
            pay:req.body.pay

        });

        await jobs.save();

        req.session.message = {
            type: "success",
            message: "job added successfully"
        };
        res.redirect('/jobs');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

















router.get("/jobs", isLoggedIn,async (req, res) => {
    try {
const jobs = await Job.find().populate('categorie_id').populate('employer_id').populate('citie_id').exec();

            res.render("backend/jobs", {
            title: "jobs",
            jobs: jobs,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});




router.get("/add_job",isLoggedIn,async (req, res) => {
    const categories = await Categorie.find({});
    const employers = await Employer.find({});
    const cities = await Citie.find({});

    res.render("backend/add_job",{
        title:"jobs Page",
        categories,
        employers  ,
        cities  });
});




router.get('/edit-job/:id', isLoggedIn,async function (req, res) {
    try {
        const job = await Job.findById(req.params.id).exec();
        if (!job) {
            return res.redirect('/job/pages/');
        }
        const categories = await Categorie.find({}); // Fetch categories
         const Employer=require("../models/employers")
        const employers = await Employer.find({}); // Fetch categories
        const cities = await Citie.find({});

        res.render('backend/edit_job', {
            title: req.body.title,
            desc: req.body.desc,
            status: req.body.status,
            pay:req.body.pay,
            id: job._id,
            job: job,
            title:"edit_job",

            message: "job updated successfully",
            categories,
            employers,
            cities
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-job/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;
     var  { title,desc,status,pay  } = req.body;

    try {
        let result = await Job.findByIdAndUpdate(id, {

            title:title,
            desc:desc,
            status:status,
            pay:pay,
            categorie_id: req.body.categorie_id,
            employer_id: req.body.employer_id,
            citie_id: req.body.citie_id,

        });

        if (!result) {
            res.json({ message: "Categorie not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Countrie updated successfully"
            };
                res.redirect('/jobs');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-job/:id', isLoggedIn,async function (req, res) {
    try {
        await Job.findByIdAndDelete(req.params.id);
        const jobs = await Job.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.jobs = jobs;
     {
            req.session.message = {
                type: "success",
                message: "City Delete successfully"
            };


            res.redirect("/jobs");
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





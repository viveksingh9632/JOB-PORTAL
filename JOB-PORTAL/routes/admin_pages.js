



const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"
const passport = require('passport');

const Admin=require("../models/admins")

const Categorie=require("../models/categories")

  
router.post("/add_admin",isLoggedIn, async (req, res) => {
    try {
        // Function to check if an email already exists
        async function checkEmailExists(email) {
            const user = await Admin.findOne({ email });
            return !!user; // If user exists, return true; otherwise, return false
        }

        // Check if the email already exists
        const emailExists = await checkEmailExists(req.body.email);

        if (emailExists) {
            req.session.message = {
                type: "danger",
                message: "Admin email already exists."
            };
            return res.redirect("/add_admin");
        }

        // Create a new admin instance
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            categorie_id: req.body.categorie_id,

            password: req.body.password,
                   
        
        });

        // Save the new admin to the database
        await admin.save();

        // Set a success message in the session and redirect
        req.session.message = {
            type: "success",
            message: "Admin added successfully!"
          };
        res.redirect("/admins");

    } catch (err) {
        // Send an error response if something goes wrong
        res.json({ message: err.message, type: "danger" });
    }
});
  







router.get("/admins", isLoggedIn,async (req, res) => {
    try {
        const admins = await Admin.find().populate('categorie_id').exec();

        res.render("backend/admins", {
            title: "Admin",
            admins,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/add_admin", isLoggedIn,async(req, res) => {

    const categories = await Categorie.find({});

    res.render("backend/add_admin",{
        title:"Admin Page",
        categories,
    });
});







router.get('/edit-admin/:id', isLoggedIn,async function (req, res) {
    try {
        const admin = await Admin.findById(req.params.id).exec();
        if (!admin) {
            return res.redirect('/admin/pages/');
        }
        const categories = await Categorie.find({}); // Fetch categories

        res.render('backend/edit_admin', {
            name: admin.name,
            password: admin.password,
            email: admin.email,
            id: admin._id,
            admin:admin,

            title:"edit_Admin",

            message: "Admin updated successfully",
            categories

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit-admin/:id', isLoggedIn,async function (req, res) {
    var id = req.params.id;

     var  { name, password, email, } = req.body;

    try {
        let result = await Admin.findByIdAndUpdate(id, {
            name: name,
            email: email,
            password:password,

            categorie_id: req.body.categorie_id,


        });

        if (!result) {
            res.json({ message: "Admin not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Admin updated successfully"
            };
                res.redirect('/admins');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete-admin/:id', isLoggedIn,async function (req, res) {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        const admins = await Admin.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.admins = admins;
     {
            req.session.message = {
                type: "success",
                message: "Admin Delete successfully"
            };


            res.redirect("/admins");
        }
    } catch (err) {
        console.error(err);
    }
});



router.get('/dashboard',(req,res)=>{
    const message = req.session.message;
  
     console.log(message)
      req.session.message = "";
    
    
     res.render('backend/dashboard' ,{message,title:"yes"})
  });
  



  router.get("/", async (req, res) => {
    try {
  
  
      res.render("frontend/home", );
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
    }
  });

router.get("/login", (req, res) => {
    const message = req.session.message;
  
    req.session.message = "";
    console.log(message);
  
    res.render("backend/login", { title: "Login Users", message, });
  });
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));
  
  // Logout route
  router.get('/logout', (req, res) => {
    // Destroy the user session with a callback function
    req.logout(() => {
        // After logout, redirect the user to the login page or any other desired page
        res.redirect('/login'); // Redirect to the login page
    });
  });
  
  
  
  
  
  
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
  }
    
  
module.exports = router;

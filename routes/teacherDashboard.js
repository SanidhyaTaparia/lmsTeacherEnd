const express = require('express');
const teacherDashboardRoute = express.Router();
const Classes = require('../models/Classes.js');
const Users = require('../models/Users.js');
const Assignments = require('../models/Assignments.js');


// /teacherDashboard
teacherDashboardRoute.get('/', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const email = req.cookies['email'];
        let allClasses = await Classes.find({ classTeacherEmail: email }).lean();
        // console.log(allClasses);

        res.render('teacherDashboard', { layout: 'teacherLoggedIn', allClasses: allClasses  });
    } catch (error) {
        res.send(error);
    }
})


// /teacherDashboard/create
teacherDashboardRoute.get('/create', (req, res) => {
    try {
        // passing all the class details in form of array to the template
        res.render('createClass', { layout: 'teacherLoggedIn' });
    } catch (error) {
        res.send(error);
    }
})

// /teacherDashboard/:classCode
teacherDashboardRoute.get('/:classCode', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const classCode = req.params.classCode;
        let allClasses = await Classes.findOne({ classCode: classCode });
        console.log(allClasses);

        res.render('classDashboard', { layout: 'singleClass', allClasses: allClasses , classCode: classCode });
    } catch (error) {
        res.send(error);
    }
});


// /teacherDashboard/create
// @POST request to create an antity in db
teacherDashboardRoute.post('/create', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        console.log('post request revied');
            
        let classCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3);
        let email = req.cookies['email'];
        let user = await Users.findOne({ email: email });
        console.log(user);

        var newClass = new Classes({
            className: req.body.className,
            classDescription: req.body.classDescription,
            classCode: classCode,
            classTeacher: user['firstName'] + ' ' + user['lastName'],
            classTeacherEmail: email,
            classTeacherImage: user['image'] || 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + user['firstName'] + '+' + user['lastName'] + "&size=96",
        });

        await newClass.save();
        console.log(newClass);
        res.redirect('/teacherDashboard');
    } catch (error) {
        res.send(error);
    }
})


// teacherDashboard/:classCode/create
teacherDashboardRoute.get('/:classCode/create', async (req, res) => {
    try {
        res.render('createAssignment', { layout: 'blank' })
    } catch (error) {
        res.send(error);
    }
})


// teacherDashboard/:classCode/create
// @POST 
teacherDashboardRoute.post('/:classCode/create/:filename', async (req, res) => {
    try {
        const classCode = req.params.classCode;
        const fileUploadName = req.params.filename;
        const title = req.body.title;
        const description = req.body.description;
        const totalMarks = req.body.totalMarks;
        const deadline = req.body.deadline;
        const email = req.cookies['email'];

        let newAssignment = new Assignments({
            classCode: classCode,
            fileUploadName: fileUploadName,
            title: title,
            description: description,
            totalMarks: totalMarks,
            deadline: deadline,
            profEmail: email,
        });

        await newAssignment.save();

        res.redirect('/teacherDashboard/' + classCode);
        
        
    } catch (error) {
        res.send(error);
    }
});


module.exports = teacherDashboardRoute;
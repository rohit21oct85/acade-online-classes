const dotenv = require('dotenv').config();
const express = require("express");
var bb = require('express-busboy');
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require('express-session')
const Routes = require("./apps/routes/index");
const cronJob = require('cron').CronJob;
const {cronTask} = require('./crontask.js');
const responseTime = require('response-time');

const app = express();
app.use(responseTime())

/* Cron Task */
var job = new cronJob({
    cronTime: '* * * * * *',
    onTick: function() {
        cronTask()
   },
    start: false,
    timeZone: 'Asia/Kolkata'
  });
job.start();

app.use(cors());
const bb_options = {
    upload: true,
    path: '/storage/admin',
    allowedPath: /./
}
bb_options.mimeTypeLimit = [
    'text/x-markdown',
    'application/javascript',
    'image/jpeg',
    'image/png'
];
bb_options.allowedPath = function(url) {
    return url == '/storage/admin';
}
bb.extend(app, bb_options);

const PORT = process.env.PORT || 8080;

const flash = require('connect-flash')
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

// express session 
app.use(session({
    secret: 'shivam-secerate',
    resave: true,
    saveUninitialized: true
}));
// connect flash session
app.use(flash());

// global vars session
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// DB Cofiguration
const options = { 
    useFindAndModify: false, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
};
// connecction MOngo DB
(async() => {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, options)
    .then(() => console.log(`Mongo DB Connected`))
    .catch(err => console.log(err));

    app.listen(PORT, () => {
        console.log(`App is running on PORT ${PORT}`);
    })
})()


// login
app.get(`/api/v1/test`, (req, res) => {
    res.send(`Test  Api running on Dev Environment`);
})
app.use("/api/v1/admin", Routes.adminAuth);
app.use("/api/v1/module", Routes.moduleRoutes);
app.use("/api/v1/vehicle", Routes.vehicleRoutes);
app.use("/api/v1/category", Routes.categoryRoutes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('views/build'));
    app.get('/*', (req, res) => {
        const index = path.join(__dirname, 'views', 'build', 'index.html');
        res.sendFile(index);
    });
}else{
    app.get('/*', (req, res) => {
        res.send("App is running on Dev Environment")
    });
}

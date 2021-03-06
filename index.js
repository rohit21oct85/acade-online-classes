const OS = require('os');
const cluster = require('cluster');
let numCPUs = OS.cpus().length*2

const dotenv = require('dotenv').config();
const express = require("express");
// var bb = require('express-busboy');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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
    cronTime: '00 05 00 * * *',
    onTick: function() {
        cronTask()
   },
    start: false,
    timeZone: 'Asia/Kolkata'
  });
job.start();
// var corsOptions = {
//     origin: ['https://*.acadelearn.com/','http://admin-acadelearn.herokuapp.com/'],
//     optionsSuccessStatus: 200 // For legacy browser support
// }
app.use(cors());

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));


const PORT = process.env.PORT || 8080;

const flash = require('connect-flash')
let ALLOWED_ORIGINS = ['https://acade-demo-school.acadelearn.com/','http://admin-acadelearn.herokuapp.com/'];
app.use((req, res, next) => {
    let origin = req.headers.origin;
    let theOrigin = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];
    res.header("Access-Control-Allow-Origin", "*");
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
    mongoose.Promise = global.Promise;
    if(cluster.isMaster) {
        console.log('Master cluster setting up ' + numCPUs + ' workers...');
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' is online');
        });
        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died.');
            console.log('Starting a new worker with new pid ' + worker.process.pid);
            cluster.fork();
        });
    }else{
        process.env.UV_THREADPOOL_SIZE = numCPUs
        app.listen(PORT, () => {
            console.log(`App is running pid ${process.pid} on PORT ${PORT}`);
        })
    }
    
})()


// login
app.get(`/api/v1/test`, (req, res) => {
    res.send(`Test  Api running on Dev Environment`);
})

app.use("/api/v1/admin", Routes.adminAuth);
app.use("/api/v1/role", Routes.roleRoutes);
app.use("/api/v1/module", Routes.moduleRoutes);
app.use("/api/v1/permission", Routes.permissionRoutes);
app.use("/api/v1/class", Routes.classRoutes);
app.use("/api/v1/school", Routes.schoolRoutes);
app.use("/api/v1/subject", Routes.subjectRoutes);
app.use("/api/v1/unit", Routes.unitRoutes);
app.use("/api/v1/unit-test", Routes.unitTestRoutes);
app.use("/api/v1/assign-test", Routes.assignTestRoutes);
app.use("/api/v1/chapter", Routes.chapterRoutes);
app.use("/api/v1/student", Routes.studentRoutes);
app.use("/api/v1/teacher", Routes.teacherRoutes);
app.use("/api/v1/question-bank", Routes.questionRoutes);
app.use("/api/v1/principal", Routes.principalRoutes);
app.use("/api/v1/teacher-subject-mapping", Routes.teacherSubjectMappingRoutes);
app.use("/api/v1/teacher-class-mapping", Routes.teacherClassMappingRoutes);
app.use("/api/v1/class-subject-mapping", Routes.classSubjectMappingRoutes);
app.use("/api/v1/mock-test", Routes.mockTestRoutes);
app.use("/api/v1/test-report", Routes.testReportRoutes);
app.use("/api/v1/web", Routes.webRoutes);



const directory = path.join(__dirname, 'apps/uploads');
app.use('/uploads', express.static(directory));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    app.get('/*', (req, res) => {
        const index = path.join(__dirname, 'build', 'index.html');
        res.sendFile(index);
    });
}

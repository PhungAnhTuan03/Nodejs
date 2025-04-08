// File: app.js

const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const apiRoutes = require('./apps/routers/api');
const apiViews = require('./apps/routers/apiviews');
const Job = require('./apps/models/Job');

const app = express();


const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Connect MongoDB
mongoose.connect('mongodb+srv://sa:sa@cluster03.egee7.mongodb.net/findjobs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/partial", express.static(path.join(__dirname, "/views/partial")));

// View Engine Setup
app.use(expressLayouts); // Use express-ejs-layouts before setting the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/apps/views"));
app.set("layout", "./layouts/layout"); // Set default layout file

// Middleware để gán mặc định title nếu chưa có
app.use((req, res, next) => {
    res.locals.title = 'Trang tuyển dụng'; // default title
    next();
});
// Routes
app.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.render('home', {
            jobs, title: 'Trang chủ',
            login: req.query.login
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tải danh sách công việc');
    }
});

app.use(session({
    secret: 'E1#n9c2W*0pS5bD6!fZ8mQ3rT',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));

app.use('/', apiViews);
app.use('/api', apiRoutes);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

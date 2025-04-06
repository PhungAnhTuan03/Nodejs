// const express = require('express')
// const dotenv = require('dotenv')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
// const app = express()
// const port = 8080
// const punycode = require('punycode');

// const authRouter = require('./apps/routers/auth')
// const userRouter = require('./apps/routers/user')
// // const restaurantRouter = require('./apps/routers/restaurant')
// // const categoryRouter = require('./apps/routers/category')
// // const foodRouter = require('./apps/routers/food')
// // const cartRouter = require('./apps/routers/cart')
// // const addressRouter = require('./apps/routers/address')
// // const orderRouter = require('./apps/routers/order')
// // const driverRouter = require('./apps/routers/driver')


// dotenv.config()

// var admin = require("firebase-admin");

// var serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// mongoose.connect(process.env.MONGO_URL).then(() => console.log('Db connected')).catch((err) => console.log(err))

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/', authRouter);
// app.use('/api/users', userRouter);
// // app.use('/api/restaurant', restaurantRouter);
// // app.use('/api/category', categoryRouter);
// // app.use('/api/foods', foodRouter);
// // app.use('/api/cart', cartRouter);
// // app.use('/api/address', addressRouter);
// // app.use('/api/orders', orderRouter);
// // app.use('/api/drivers', driverRouter);


// // Khởi động server
// app.listen(process.env.PORT || port, () => console.log(`Foodly backend app listening on port ${process.env.PORT}!`))



const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('../Website_tuyendungvaungtuyen_NhomLKT/apps/routers/api');
const Job = require('../Website_tuyendungvaungtuyen_NhomLKT/apps/models/Job');
const apiViews = require('../Website_tuyendungvaungtuyen_NhomLKT/apps/routers/apiviews');

var bodyParser = require('body-parser')


const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://sa:sa@cluster03.egee7.mongodb.net/findjobs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Cấu hình body parser để xử lý dữ liệu POST từ form
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình thư mục chứa file tĩnh
app.use("/static", express.static(__dirname + "/public"));
app.use("/partial", express.static(__dirname + "/views/partial"));

// Cấu hình EJS làm view engine
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }); // lấy tất cả jobs, sắp xếp mới nhất
        res.render('home', { jobs }); // ✅ truyền jobs vào view
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tải danh sách công việc');
    }
});

// Cấu hình các route để hiển thị views
app.use('/', apiViews);
// Sử dụng API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

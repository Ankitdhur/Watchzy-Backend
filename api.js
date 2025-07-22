const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const dbLink = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.3yiuj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbLink)
    .then(() => {
        console.log("Database connected successfully");

        const AuthRouter = require("./Routers/AuthRouter");
        const MovieRouter = require("./Routers/MovieRouter");
        const TvShowsRouter = require("./Routers/TvRouter");
        const DiscoverRouter = require("./Routers/DiscoverRouter");
        const UserRouter = require("./Routers/UserRouter");
        const VideoRouter = require("./Routers/VideoRouter");
        const PaymentRouter = require("./Routers/PaymentRouter");

        app.use("/api/auth", AuthRouter);
        app.use("/api/movies", MovieRouter);
        app.use("/api/tv", TvShowsRouter);
        app.use("/api/discover", DiscoverRouter);
        app.use("/api/user", UserRouter);
        app.use("/api/video", VideoRouter);
        app.use("/api/payment", PaymentRouter);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

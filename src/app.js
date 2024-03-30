import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import expertRouter from "./routes/expert.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import reportRouter from "./routes/report.routes.js";
import postRouter from "./routes/post.routes.js";
import jobRouter from "./routes/job.routes.js";

//routes declaration
// http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter);
app.use("/api/v1/experts", expertRouter);
app.use("/api/v1/users-experts", bookingRouter);
app.use("/api/v1/users-experts", feedbackRouter);
app.use("/api/v1/users-experts", reportRouter);
app.use("/api/v1/creaters", postRouter);
app.use("/api/v1/creaters", jobRouter);

export { app };

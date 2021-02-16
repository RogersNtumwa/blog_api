const path = require("path")
const express = require("express")
const app = express()
const dotenv = require("dotenv");

// security packages
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean") 
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

const dbContext = require("./src/config/database");
const appError = require("./src/utils/appError");
const auth = require("./src/routes/auth")
const posts = require("./src/routes/post")


dotenv.config({ path: "./src/config/config.env" });

// Sanitize data
app.use(mongoSanitize())

// Set security haeders
app.use(helmet())

// Prevent xss attacks
app.use(xss())

// Rate liimit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max:100
  
})
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

dbContext();

// serving static files
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.use("/api/v1/posts", posts)
app.use("/api/v1/auth", auth)


app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res
    .status(err.statusCode)
    .json(
      { status: err.status, message: err.message } || "Unknown error occured"
    );
});

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`App started on port ${PORT}`))
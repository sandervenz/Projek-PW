import express from "express";
import db from "./utils/database";
import routes from "./routes/api";
import bodyParser from "body-parser";
import docs from "./docs/route";
import {
  errorNotFoundMiddleware,
  errorServerMiddleware,
} from "./middlewares/error.middleware";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes and origins (you can adjust it as needed)
app.use(cors());

db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/menu", routes);

// Inisialisasi Swagger UI
docs(app);

app.use(errorNotFoundMiddleware);
app.use(errorServerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

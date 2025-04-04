const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 4000;


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "new_employee_db",
    password: "Password@12345",
    port: 5432,
});

app.use(cors());
app.use(express.json());


app.get("/employees", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM emp_onboarding");  
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

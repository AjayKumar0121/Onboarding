
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password@12345",
    database: "new_employee_db"
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

app.post("/save-employee", upload.fields([
    { name: "emp_experience_doc" },
    { name: "emp_ssc_doc" },
    { name: "emp_inter_doc" },
    { name: "emp_grad_doc" }
]), (req, res) => {
    const {
        emp_name, emp_email, emp_dob, emp_mobile, emp_address, emp_city,
        emp_state, emp_zipcode, emp_bank, emp_account, emp_ifsc, emp_job_role,
        emp_department, emp_experience_status, emp_company_name, emp_years_of_experience,
        emp_joining_date, emp_terms_accepted
    } = req.body;

    const sql = `INSERT INTO emp_onboarding 
        (emp_name, emp_email, emp_dob, emp_mobile, emp_address, emp_city, emp_state, 
        emp_zipcode, emp_bank, emp_account, emp_ifsc, emp_job_role, emp_department, 
        emp_experience_status, emp_company_name, emp_years_of_experience, emp_joining_date, 
        emp_experience_doc, emp_ssc_doc, emp_inter_doc, emp_grad_doc, emp_terms_accepted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        emp_name, emp_email, emp_dob, emp_mobile, emp_address, emp_city,
        emp_state, emp_zipcode, emp_bank, emp_account, emp_ifsc, emp_job_role,
        emp_department, emp_experience_status, emp_company_name || null,
        emp_years_of_experience || null, emp_joining_date,
        req.files["emp_experience_doc"] ? req.files["emp_experience_doc"][0].filename : null,
        req.files["emp_ssc_doc"] ? req.files["emp_ssc_doc"][0].filename : null,
        req.files["emp_inter_doc"] ? req.files["emp_inter_doc"][0].filename : null,
        req.files["emp_grad_doc"] ? req.files["emp_grad_doc"][0].filename : null,
        emp_terms_accepted ? 1 : 0
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).json({ error: "Database error", details: err });
        } else {
            res.status(200).json({ message: "Employee added successfully" });
        }
    });
});

app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM emp_onboarding";
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Database error", details: err });
        } else {
            res.json(result);
        }
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();

// Middleware: Check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

/* -------------------------------------------
  P27: Basic CRUD (Employee Form)
------------------------------------------- */

// GET /employees -> List employees (EJS)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("employees", { employees });
  } catch (err) {
    res.status(500).send("Error retrieving employees");
  }
});

// GET /employees/new -> Show a form to add new employee
router.get("/new", isAuthenticated, (req, res) => {
  res.render("index"); // Using index.ejs as the 'Add Employee' form
});

// POST /employees -> Create new employee from form
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // If multiple skills are selected
    let skills = req.body.skills;
    if (!Array.isArray(skills)) skills = [skills];

    const newEmployee = new Employee({
      ...req.body,
      skills,
    });
    await newEmployee.save();
    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Error creating employee");
  }
});

// GET /employees/:id/edit -> Show edit form
router.get("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).send("Employee not found");
    // You might create an 'editEmployee.ejs' to handle updates
    res.send(emp);
  } catch (err) {
    res.status(500).send("Error retrieving employee");
  }
});

// POST /employees/:id -> Update existing employee
router.post("/:id", isAuthenticated, async (req, res) => {
  try {
    let skills = req.body.skills;
    if (!Array.isArray(skills)) skills = [skills];

    await Employee.findByIdAndUpdate(req.params.id, {
      ...req.body,
      skills,
    });
    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Error updating employee");
  }
});

// GET /employees/:id/delete -> Delete employee
router.get("/:id/delete", isAuthenticated, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Error deleting employee");
  }
});

/* -------------------------------------------
  P30: RESTful API (Test in Postman)
------------------------------------------- */

// CREATE -> POST /employees/api
router.post("/api", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "Employee created", employee });
  } catch (err) {
    res.status(500).json({ error: "Error creating employee" });
  }
});

// READ ALL -> GET /employees/api
router.get("/api", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving employees" });
  }
});

// READ ONE -> GET /employees/api/:id
router.get("/api/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving employee" });
  }
});

// UPDATE -> PUT /employees/api/:id
router.put("/api/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!employee) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Employee updated", employee });
  } catch (err) {
    res.status(500).json({ error: "Error updating employee" });
  }
});

// DELETE -> DELETE /employees/api/:id
router.delete("/api/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

module.exports = router;

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const { route } = require("./companies");

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    if (results.rows.length === 0) {
      throw new ExpressError("no results found", 404);
    }
    return res.json({ invoices: results.rows });
  } catch (e) {
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      throw new ExpressError(`No invoice with id: ${id} found`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code,amt) VALUES ($1,$2) RETURNING id, comp_code,amt, paid, add_date,paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    const result = await db.query(
      `UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id,comp_code,amt,paid,add_date,paid_date`,
      [amt, id]
    );
    if (!result) {
      throw new ExpressError(`No invoice found with id: ${id}`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      throw new ExpressError(`No invoice found with id: ${id}`, 404);
    }
    return res.json({ status: "deleted" });
  } catch (e) {
    return next(e);
  }
});

router.get("/companies/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const companyResult = await db.query(
      `SELECT name, description FROM companies WHERE code=$1`,
      [code]
    );
    if (companyResult.rows.length === 0) {
      throw new ExpressError(`No company with code: ${code}`, 404);
    }
    const invoiceResults = await db.query(
      `SELECT id,amt,paid,add_date,paid_date FROM invoices WHERE comp_code=$1`,
      [code]
    );

    const result = {
      code: code,
      name: companyResult.rows[0].name,
      description: companyResult.rows[0].description,
      invoices: invoiceResults.rows,
    };
    return res.json({ company: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

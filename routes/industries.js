const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");

router.post("/", async (req, res, next) => {
  try {
    const { code, industry, comp_code } = req.body;
    const response = await db.query(
      `INSERT INTO industries (code,industry,comp_code)VALUES ($1,$2,$3) RETURNING code,industry,comp_code`,
      [code, industry, comp_code]
    );
    return res.json({ industry: response.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(
      `SELECT code,industry,comp_code FROM industries  `
    );
    return res.json({ industries: results.rows });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

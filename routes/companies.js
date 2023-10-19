const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows });
  } catch (e) {
    return next(e);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const result = await db.query(
      `
      SELECT c.code AS company_code, c.name AS company_name, c.description AS company_description,
             i.code AS industry_code, i.industry AS industry_name
      FROM companies AS c
      LEFT JOIN industries AS i ON c.code = i.comp_code
      WHERE c.code = $1
    `,
      [code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(
        `Code ${code} can no be fund in the database`,
        404
      );
    }
    return res.json({ companie: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await db.query(
      `INSERT INTO companies (code,name,description)VALUES ($1,$2,$3) RETURNING code,name,description`,
      [slugify(code, { lower: true, strict: true }), name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (e) {
    next(e);
  }
});
router.put("/:code", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { code } = req.params;
    const result = await db.query(
      `UPDATE companies SET name = $1, description =$2 WHERE code=$3 RETURNING code,name,description`,
      [name, description, code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can not find company with code ${code}`, 404);
    }
    return res.json({ company: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(`DELETE FROM companies WHERE code = $1`, [
      code,
    ]);
    if (!result) {
      throw new ExpressError(`Can not find company with code ${code}`, 404);
    }
    return res.json({ status: "deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

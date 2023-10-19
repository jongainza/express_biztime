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

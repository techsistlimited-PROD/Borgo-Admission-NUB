import express from 'express';
import { dbAll, dbGet, dbRun } from '../database/config.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Public: list registration packages
router.get('/', async (req, res) => {
  try {
    const pkgs = await dbAll('SELECT * FROM registration_packages ORDER BY term, program');
    res.json({ success: true, data: pkgs });
  } catch (err) {
    console.error('Get registration packages error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Admin CRUD
router.use(authenticateToken, requireAdmin);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { id, program, term, mode, credits, admission_fee, per_credit, fixed_fees, total_estimated } = req.body;
    if (!id || !program) return res.status(400).json({ success: false, error: 'id and program required' });
    await dbRun(
      `INSERT OR REPLACE INTO registration_packages (id, program, term, mode, credits, admission_fee, per_credit, fixed_fees, total_estimated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, program, term || null, mode || null, credits || 0, admission_fee || 0, per_credit || 0, fixed_fees || 0, total_estimated || 0]
    );
    const row = await dbGet('SELECT * FROM registration_packages WHERE id = ?', [id]);
    res.json({ success: true, data: row });
  } catch (err) {
    console.error('Create registration package error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existing = await dbGet('SELECT * FROM registration_packages WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Package not found' });

    const program = updates.program ?? existing.program;
    const term = updates.term ?? existing.term;
    const mode = updates.mode ?? existing.mode;
    const credits = updates.credits ?? existing.credits;
    const admission_fee = updates.admission_fee ?? existing.admission_fee;
    const per_credit = updates.per_credit ?? existing.per_credit;
    const fixed_fees = updates.fixed_fees ?? existing.fixed_fees;
    const total_estimated = updates.total_estimated ?? existing.total_estimated;

    await dbRun(
      `UPDATE registration_packages SET program = ?, term = ?, mode = ?, credits = ?, admission_fee = ?, per_credit = ?, fixed_fees = ?, total_estimated = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [program, term, mode, credits, admission_fee, per_credit, fixed_fees, total_estimated, id]
    );

    const row = await dbGet('SELECT * FROM registration_packages WHERE id = ?', [id]);
    res.json({ success: true, data: row });
  } catch (err) {
    console.error('Update registration package error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM registration_packages WHERE id = ?', [id]);
    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error('Delete registration package error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

/**
 * Given a Chantier instance (with phases → tasks → assignments → users loaded),
 * returns a de‐duplicated array of all users assigned anywhere in that chantier.
 */
function extractIntervenants(chantier) {
  const seen = new Map();
  (chantier.phases || []).forEach((phase) =>
    (phase.tasks || []).forEach((task) =>
      (task.assignments || []).forEach((assign) =>
        (assign.users || []).forEach((u) => {
          if (!seen.has(u.id)) seen.set(u.id, u);
        }),
      ),
    ),
  );
  return Array.from(seen.values());
}

module.exports = { extractIntervenants };

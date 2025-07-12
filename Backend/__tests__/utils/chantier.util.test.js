const { extractIntervenants } = require('../../app/utils/chantier');

describe('Utils - Chantier', () => {
  describe('extractIntervenants', () => {
    it('should return an empty array if no phases or assignments', () => {
      const chantier = { phases: [] };
      const result = extractIntervenants(chantier);
      expect(result).toEqual([]);
    });

    it('should return unique users across all assignments in a chantier', () => {
      // Prepare chantier with duplicate user assignments
      const userA = { id: 1, name: 'Alice' };
      const userB = { id: 2, name: 'Bob' };
      const userC = { id: 3, name: 'Charlie' };
      const chantier = {
        phases: [
          {
            tasks: [
              {
                assignments: [
                  { users: [userA, userB] },
                  { users: [userB, userC] }
                ]
              }
            ]
          },
          {
            tasks: [
              {
                assignments: [
                  { users: [userA] }
                ]
              }
            ]
          }
        ]
      };
      const result = extractIntervenants(chantier);
      // Expect unique users: Alice, Bob, Charlie
      expect(result).toEqual(expect.arrayContaining([userA, userB, userC]));
      expect(result).toHaveLength(3);
      // Ensure no duplicate user IDs in result
      const ids = result.map(u => u.id);
      const uniqueIds = Array.from(new Set(ids));
      expect(ids).toEqual(uniqueIds);
    });
  });
});

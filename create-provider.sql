-- Insert provider record for Admin User
INSERT INTO "Provider" (
  "id",
  "userId",
  "name",
  "specialization",
  "email",
  "phone",
  "bio",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'ddad4eae-5c50-4bed-af49-fddc40553c2c',
  'Admin User',
  'General Practitioner',
  'admin@test.com',
  '1234567890',
  'Experienced healthcare provider',
  NOW(),
  NOW()
);

-- Verify the insert
SELECT * FROM "Provider" WHERE "userId" = 'ddad4eae-5c50-4bed-af49-fddc40553c2c';

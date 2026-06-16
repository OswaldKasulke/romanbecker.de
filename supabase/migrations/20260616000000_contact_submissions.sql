CREATE TABLE contact_submissions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  restaurant text        NOT NULL,
  email      text        NOT NULL,
  message    text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

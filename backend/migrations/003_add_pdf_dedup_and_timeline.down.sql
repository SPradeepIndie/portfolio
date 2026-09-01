ALTER TABLE projects DROP COLUMN IF EXISTS timeline;
ALTER TABLE projects ADD COLUMN timeline VARCHAR(255);

ALTER TABLE uploaded_pdfs DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE uploaded_pdfs DROP COLUMN IF EXISTS file_hash;

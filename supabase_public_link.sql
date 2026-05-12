-- Migration: public link sharing
-- Run this in Supabase SQL Editor

ALTER TABLE diagnosticos
  ADD COLUMN IF NOT EXISTS token_publico TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS compartido_publicamente BOOLEAN DEFAULT FALSE;

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_diagnosticos_token_publico
  ON diagnosticos (token_publico)
  WHERE token_publico IS NOT NULL;

-- Public view: exposes only diagnostics marked as shared, without PII
-- Accessible by anon role (no auth required)
CREATE OR REPLACE VIEW diagnosticos_publicos AS
SELECT
  id,
  fecha,
  empresa_nombre,
  empresa_sector,
  empresa_tamanio,
  empresa_cargo,
  empresa_ciudad,
  puntaje_global,
  nivel_global,
  resultados,
  benchmark,
  ruta_90_dias,
  recomendaciones,
  token_publico,
  compartido_publicamente
FROM diagnosticos
WHERE compartido_publicamente = TRUE
  AND token_publico IS NOT NULL;

-- Allow anon to read the public view (no auth needed for shared results)
GRANT SELECT ON diagnosticos_publicos TO anon;
GRANT SELECT ON diagnosticos_publicos TO authenticated;

-- Allow authenticated users to update their own token columns
CREATE POLICY "users can set own public token"
  ON diagnosticos
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

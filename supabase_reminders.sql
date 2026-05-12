-- Migration: 90-day email reminders
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS recordatorios_90dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT,
  diagnostico_id UUID REFERENCES diagnosticos(id) ON DELETE CASCADE,
  puntaje_global INTEGER,
  nivel_global TEXT,
  fecha_diagnostico TIMESTAMPTZ NOT NULL,
  fecha_recordatorio TIMESTAMPTZ NOT NULL,
  enviado BOOLEAN DEFAULT FALSE,
  fecha_envio TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_diagnostico_recordatorio UNIQUE (diagnostico_id)
);

-- RLS
ALTER TABLE recordatorios_90dias ENABLE ROW LEVEL SECURITY;

-- Users can only see/manage their own reminders
CREATE POLICY "users own reminders"
  ON recordatorios_90dias
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for cron query
CREATE INDEX IF NOT EXISTS idx_recordatorios_pendientes
  ON recordatorios_90dias (fecha_recordatorio)
  WHERE enviado = FALSE;

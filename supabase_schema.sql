-- ============================================================
-- DiagnosticoTIC – Esquema de base de datos Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1. Tabla de perfiles (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre    text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- 2. Tabla de diagnósticos
CREATE TABLE IF NOT EXISTS public.diagnosticos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fecha            timestamptz DEFAULT now(),
  empresa_nombre   text,
  empresa_sector   text,
  empresa_tamanio  text,
  empresa_cargo    text,
  empresa_ciudad   text,
  puntaje_global   integer,
  nivel_global     text,
  respuestas       jsonb,
  resultados       jsonb,
  recomendaciones  jsonb,
  ruta_90_dias     jsonb,
  benchmark        jsonb,
  created_at       timestamptz DEFAULT now()
);

-- 3. Row Level Security (cada usuario solo ve sus propios datos)
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfil propio" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Ver propios diagnósticos" ON public.diagnosticos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insertar propios diagnósticos" ON public.diagnosticos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar propios diagnósticos" ON public.diagnosticos
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Vista de benchmark anónimo (solo muestra sectores con 3+ empresas)
CREATE OR REPLACE VIEW public.benchmark_anonimo AS
SELECT
  empresa_sector                                       AS sector,
  empresa_tamanio                                      AS tamanio,
  COUNT(*)                                             AS n_empresas,
  ROUND(AVG(puntaje_global))                           AS promedio_global,
  ROUND(AVG((resultados->0->>'puntaje')::numeric))     AS promedio_estrategia,
  ROUND(AVG((resultados->1->>'puntaje')::numeric))     AS promedio_tecnologia,
  ROUND(AVG((resultados->2->>'puntaje')::numeric))     AS promedio_datos,
  ROUND(AVG((resultados->3->>'puntaje')::numeric))     AS promedio_talento,
  ROUND(AVG((resultados->4->>'puntaje')::numeric))     AS promedio_cliente
FROM public.diagnosticos
GROUP BY empresa_sector, empresa_tamanio
HAVING COUNT(*) >= 3;

-- 5. Trigger: crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Verificación: estas consultas deben devolver 0 errores
-- ============================================================
SELECT 'profiles OK'     FROM information_schema.tables WHERE table_name = 'profiles';
SELECT 'diagnosticos OK' FROM information_schema.tables WHERE table_name = 'diagnosticos';

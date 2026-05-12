-- ============================================================
-- DiagnosticoTIC – Funciones de métricas para panel admin
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- IMPORTANTE: Ejecutar DESPUÉS de supabase_schema.sql
-- ============================================================

-- 1. Métricas globales agregadas (sin PII, bypass RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_diagnosticos', COUNT(*),
    'total_usuarios',     COUNT(DISTINCT user_id),
    'promedio_global',    COALESCE(ROUND(AVG(puntaje_global)), 0),
    'niveles', jsonb_build_object(
      'Inicial',       COUNT(*) FILTER (WHERE nivel_global = 'Inicial'),
      'Explorando',    COUNT(*) FILTER (WHERE nivel_global = 'Explorando'),
      'Definido',      COUNT(*) FILTER (WHERE nivel_global = 'Definido'),
      'Optimizando',   COUNT(*) FILTER (WHERE nivel_global = 'Optimizando'),
      'Transformador', COUNT(*) FILTER (WHERE nivel_global = 'Transformador')
    ),
    'por_dimension', jsonb_build_object(
      'estrategia', COALESCE(ROUND(AVG((resultados->0->>'puntaje')::numeric)), 0),
      'tecnologia',  COALESCE(ROUND(AVG((resultados->1->>'puntaje')::numeric)), 0),
      'datos',       COALESCE(ROUND(AVG((resultados->2->>'puntaje')::numeric)), 0),
      'talento',     COALESCE(ROUND(AVG((resultados->3->>'puntaje')::numeric)), 0),
      'cliente',     COALESCE(ROUND(AVG((resultados->4->>'puntaje')::numeric)), 0)
    )
  ) INTO result
  FROM diagnosticos;
  RETURN result;
END;
$$;

-- 2. Diagnósticos por sector (top 10)
CREATE OR REPLACE FUNCTION public.get_stats_por_sector()
RETURNS TABLE(sector text, total bigint, promedio numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    empresa_sector::text,
    COUNT(*)::bigint,
    COALESCE(ROUND(AVG(puntaje_global)), 0)
  FROM diagnosticos
  GROUP BY empresa_sector
  ORDER BY COUNT(*) DESC
  LIMIT 10;
END;
$$;

-- 3. Tendencia mensual (últimos 12 meses)
CREATE OR REPLACE FUNCTION public.get_tendencia_mensual()
RETURNS TABLE(mes text, total bigint, promedio numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', fecha), 'YYYY-MM')::text,
    COUNT(*)::bigint,
    COALESCE(ROUND(AVG(puntaje_global)), 0)
  FROM diagnosticos
  GROUP BY DATE_TRUNC('month', fecha)
  ORDER BY DATE_TRUNC('month', fecha)
  LIMIT 12;
END;
$$;

-- 4. Distribución por tamaño
CREATE OR REPLACE FUNCTION public.get_stats_por_tamanio()
RETURNS TABLE(tamanio text, total bigint, promedio numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    empresa_tamanio::text,
    COUNT(*)::bigint,
    COALESCE(ROUND(AVG(puntaje_global)), 0)
  FROM diagnosticos
  GROUP BY empresa_tamanio
  ORDER BY COUNT(*) DESC;
END;
$$;

-- 5. Permisos: usuarios autenticados pueden llamar las funciones
--    (seguro: solo devuelven agregados, sin PII)
GRANT EXECUTE ON FUNCTION public.get_admin_stats()        TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_stats_por_sector()   TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tendencia_mensual()  TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_stats_por_tamanio()  TO authenticated;

-- ============================================================
-- Verificación
-- ============================================================
SELECT 'get_admin_stats OK'       FROM pg_proc WHERE proname = 'get_admin_stats';
SELECT 'get_stats_por_sector OK'  FROM pg_proc WHERE proname = 'get_stats_por_sector';
SELECT 'get_tendencia_mensual OK' FROM pg_proc WHERE proname = 'get_tendencia_mensual';
SELECT 'get_stats_por_tamanio OK' FROM pg_proc WHERE proname = 'get_stats_por_tamanio';

UPDATE projects
SET assets = (
  SELECT jsonb_agg(
    jsonb_set(
      asset,
      '{src}',
      to_jsonb(
        replace(asset->>'src', 'http://127.0.0.1', 'http://127.0.0.1:54321')
      )
    )
  )
  FROM jsonb_array_elements(assets) AS asset
);

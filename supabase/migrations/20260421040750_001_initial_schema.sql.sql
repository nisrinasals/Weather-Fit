/*
  # Daily Stylist Database Schema

  1. New Tables
    - `outfit_checks`
      - `id` (uuid, primary key)
      - `outfit_description` (text, user's planned outfit)
      - `weather_data` (jsonb, weather API response)
      - `verdict` (text, AI verdict - SAFE/WARNING/DISASTER)
      - `advice` (text, AI practical advice)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `outfit_checks` table
    - Allow public inserts (no auth required for this simple app)
    - Allow public reads for recent checks
*/

CREATE TABLE IF NOT EXISTS outfit_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_description text NOT NULL,
  weather_data jsonb,
  verdict text,
  advice text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE outfit_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert outfit checks"
  ON outfit_checks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view recent outfit checks"
  ON outfit_checks FOR SELECT
  TO anon, authenticated
  USING (created_at > now() - interval '24 hours');

CREATE INDEX idx_outfit_checks_created_at ON outfit_checks(created_at DESC);

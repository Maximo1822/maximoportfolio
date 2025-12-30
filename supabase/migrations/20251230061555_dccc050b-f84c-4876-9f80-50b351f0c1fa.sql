-- Add editable settings to portfolio_settings
ALTER TABLE public.portfolio_settings
ADD COLUMN IF NOT EXISTS discord_server_link text NOT NULL DEFAULT 'https://discord.gg/qDwnyGKxK',
ADD COLUMN IF NOT EXISTS water_pulse_mode text NOT NULL DEFAULT 'blue_to_white';

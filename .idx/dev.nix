{ pkgs, ... }: {
  packages = [ pkgs.postgresql pkgs.supabase-cli ];
}
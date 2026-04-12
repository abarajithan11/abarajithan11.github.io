#!/usr/bin/env bash
set -euo pipefail

repo_path="${1:-}"

if [[ -z "$repo_path" ]]; then
  echo "Missing repository path argument." >&2
  exit 1
fi

if [[ "$repo_path" == /mnt/* ]]; then
  echo "This repo is on a Windows-mounted drive ($repo_path)." >&2
  echo "Jekyll is hanging on WSL's 9p/DrvFS bridge before it starts serving pages." >&2
  echo "Use one of these instead:" >&2
  echo "  1. Clone the repo inside the WSL filesystem and open it with VS Code Remote - WSL." >&2
  echo "  2. Run Jekyll natively on Windows instead of through WSL." >&2
  exit 1
fi

if ! command -v ruby >/dev/null 2>&1; then
  echo "Ruby is not installed in WSL. Install ruby-full, build-essential, and zlib1g-dev first." >&2
  exit 1
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler is not installed in WSL. Install it with: sudo apt install -y ruby-bundler" >&2
  exit 1
fi

cd "$repo_path"
bundle install
bundle exec jekyll serve --livereload --host 0.0.0.0 --port 4000

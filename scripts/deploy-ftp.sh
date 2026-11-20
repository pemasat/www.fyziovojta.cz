#!/usr/bin/env bash
# Nahraje dist/ na hosting Gigaserver přes FTPS.
#
# Použití:  FTP_USER=… FTP_PASS=… scripts/deploy-ftp.sh
#
# - nejdřív stáhne zálohu stávajících souborů do backup-server/<datum>/
# - .htaccess na serveru nechá být; _redirects (jen pro Cloudflare) nenahrává
# - certifikát FTP serveru neprojde ověřením, proto -k (spojení je pořád šifrované)
set -euo pipefail

HOST="fyziovojta.cz"
ROOT="fyziovojta.cz"            # složka webu na FTP
: "${FTP_USER:?Nastav FTP_USER}"
: "${FTP_PASS:?Nastav FTP_PASS}"

cd "$(dirname "$0")/.."
[ -f dist/index.html ] || { echo "Chybí dist/ – spusť nejdřív: pnpm build"; exit 1; }

CURL=(curl -sS -k --ssl-reqd --ftp-create-dirs -u "$FTP_USER:$FTP_PASS")
BASE="ftp://$HOST/$ROOT"

# Kořen webu: přímo v $ROOT/, nebo v podsložce (www, public_html…)?
LIST=$("${CURL[@]}" -l "$BASE/")
echo "Obsah $ROOT/:"; echo "$LIST" | sed 's/^/  /'
if ! echo "$LIST" | grep -qx 'index.html'; then
  for sub in www public_html html htdocs; do
    if echo "$LIST" | grep -qx "$sub"; then BASE="$BASE/$sub"; break; fi
  done
fi
echo "Cíl: $BASE/"

# Záloha všech souborů v kořeni webu (bez podsložek)
BACKUP="backup-server/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"
"${CURL[@]}" "$BASE/" | while read -r perms _ _ _ _ _ _ _ name; do
  [[ $perms == -* ]] || continue
  "${CURL[@]}" -o "$BACKUP/$name" "$BASE/$name"
done
echo "Záloha: $BACKUP/ ($(ls -A "$BACKUP" | wc -l | tr -d ' ') souborů)"

# Nahrání
cd dist
find . -type f ! -name _redirects | sed 's#^\./##' | sort | while read -r f; do
  echo "  ↑ $f"
  "${CURL[@]}" -T "$f" "$BASE/$f"
done
echo "Hotovo → https://www.$HOST/"

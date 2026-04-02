# Deployment Anleitung

Diese Anleitung erklärt, wie du das GitHub Actions Deployment für deine Symfony Anwendung einrichtest.

## Deployment-Optionen (ohne SSH-Schlüssel)

### Option 1: FTP/SFTP Deployment
**Workflow**: `deploy-ftp.yml`

**Benötigte Secrets**:
- `FTP_SERVER` - FTP Server Adresse
- `FTP_USERNAME` - FTP Benutzername
- `FTP_PASSWORD` - FTP Passwort
- `FTP_PORT` - FTP Port (Standard: 21)
- `FTP_REMOTE_DIR` - Remote Verzeichnis (Standard: /)

**Vorteile**: Einfach einzurichten, funktioniert mit den meisten Hostern
**Nachteile**: Langsamer, keine automatischen Post-Deployment Befehle

### Option 2: Docker Deployment
**Workflow**: `deploy-docker.yml`

**Benötigte Secrets**:
- `DOCKER_USERNAME` - Docker Hub Benutzername
- `DOCKER_PASSWORD` - Docker Hub Passwort
- `SERVER_HOST` - Server IP/Domain
- `SERVER_USER` - Server Benutzer
- `SERVER_PASSWORD` - Server Passwort
- `SERVER_PORT` - SSH Port (Standard: 22)

**Vorteile**: Containerisiert, reproduzierbar, einfach zu rollbacken
**Nachteile**: Benötigt Docker auf dem Server

### Option 3: Rsync mit Passwort
**Workflow**: `deploy-rsync.yml`

**Benötigte Secrets**:
- `SERVER_HOST` - Server IP/Domain
- `SERVER_USER` - Server Benutzer
- `SERVER_PASSWORD` - Server Passwort
- `SERVER_PORT` - SSH Port (Standard: 22)
- `REMOTE_PATH` - Remote Pfad (Standard: /var/www/symfony)

**Vorteile**: Schnell, inkrementelle Updates, Post-Deployment Befehle
**Nachteile**: Benötigt SSH-Zugriff mit Passwort

## Server-Vorbereitung

### Für FTP/SFTP:
Stelle sicher, dass FTP/SFTP-Zugriff aktiviert ist und der Benutzer Schreibrechte hat.

### Für Docker:
```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Für Rsync:
SSH-Zugriff mit Passwort-Authentifizierung muss aktiviert sein.

## Workflow-Trigger

Der Workflow wird automatisch ausgelöst bei:
- Push auf `main` oder `master` Branch
- Manuelle Ausführung über GitHub Actions UI

## Deployment-Prozess

1. **Build-Phase** (GitHub Actions):
   - PHP 8.2 und Node.js 18 Setup
   - Composer und Yarn Dependencies installieren
   - Assets mit Webpack Encore bauen
   - Symfony Cache leeren und aufwärmen

2. **Deployment-Phase** (Server):
   - Backup der aktuellen `var` Verzeichnisse
   - Git Pull der neuesten Änderungen
   - Dependencies installieren
   - Assets bauen
   - Cache leeren und aufwärmen
   - Database Migrations ausführen
   - Berechtigungen setzen

## Fehlersuche

### Häufige Probleme:
1. **SSH-Verbindung**: Überprüfe den SSH-Schlüssel und Server-Zugriff
2. **Berechtigungen**: Stelle sicher, dass `www-data` Schreibrechte hat
3. **Composer-Cache**: Manuell leeren mit `composer clear-cache`
4. **Database Migrations**: Überprüfe Datenbank-Verbindung in `.env.local`

### Logs prüfen:
- GitHub Actions Logs im Repository
- Symfony Logs: `var/log/prod.log`
- Webserver Logs: `/var/log/apache2/` oder `/var/log/nginx/`

## Manuelles Deployment

Falls das automatische Deployment fehlschlägt:
```bash
# Auf dem Server
cd /var/www/symfony
git pull origin main
composer install --no-dev --optimize-autoloader
yarn install --production
yarn build
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
php bin/console doctrine:migrations:migrate --env=prod --no-interaction
```

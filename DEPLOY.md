# Deploying EthioWix to AWS Lightsail

## Prerequisites
- An AWS account
- A registered domain name
- Git installed locally

---

## 1. Create a Lightsail Instance

1. Go to [AWS Lightsail](https://lightsail.aws.amazon.com)
2. Click **Create instance**
3. Select:
   - **Region**: closest to your customers
   - **Platform**: Linux/Unix
   - **Blueprint**: Ubuntu 22.04 LTS
   - **Plan**: 2 GB RAM / 2 vCPU ($12/mo) — handles 100+ sites
4. Name it `ethiowix-prod` and create

## 2. Set Up a Static IP

1. In Lightsail console → **Networking** → **Create static IP**
2. Attach it to your `ethiowix-prod` instance
3. Note the IP address (you'll need it for DNS)

## 3. Open Firewall Ports

In your instance's **Networking** tab, add these rules:
- **HTTPS** — TCP 443
- **HTTP** — TCP 80

(SSH on port 22 is open by default)

## 4. Install Docker on the Instance

SSH into your instance (use the Lightsail browser terminal or your own SSH key):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y
e
# Log out and back in for group changes to take effect
exit
```

## 5. Deploy the App

SSH back in, then:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/EthioWix.git
cd EthioWix

# Create your environment file
cp .env.example .env
nano .env
# Set DOMAIN=your-domain.com (or leave as localhost for initial test)

# Build and start
docker compose up -d --build

# Check it's running
docker compose ps
docker compose logs -f
```

The app should now be accessible at `http://YOUR_LIGHTSAIL_IP`.

## 6. Connect Your Domain

1. Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)
2. Add an **A record**:
   - **Name**: `@` (or blank)
   - **Value**: your Lightsail static IP
3. Optionally add a **CNAME** for `www`:
   - **Name**: `www`
   - **Value**: `your-domain.com`
4. Wait for DNS propagation (usually 5-30 minutes)

## 7. Enable HTTPS

Once DNS is pointing to your server:

```bash
cd EthioWix

# Update .env with your real domain
nano .env
# Set DOMAIN=your-domain.com

# Restart to pick up the domain
docker compose down
docker compose up -d
```

Caddy will automatically obtain an SSL certificate from Let's Encrypt. Your site will be live at `https://your-domain.com` within a minute.

## 8. Verify

- Visit `https://your-domain.com` — you should see the EthioWix dashboard
- Create a site, publish it
- Visit `https://your-domain.com/sites/your-slug` — the published site should load

---

## Common Operations

### View logs
```bash
docker compose logs -f          # all services
docker compose logs -f app      # just the Next.js app
docker compose logs -f caddy    # just Caddy
```

### Update the app
```bash
cd EthioWix
git pull
docker compose up -d --build
```

### Restart
```bash
docker compose restart
```

### Stop
```bash
docker compose down
```

### Backup site data
```bash
# The JSON store lives in a Docker volume
docker compose cp app:/app/.data ./backup-data
```

---

## Estimated Costs

| Resource | Monthly Cost |
|----------|-------------|
| Lightsail 2GB instance | $12 |
| Static IP (attached) | $0 |
| Domain (varies) | ~$10-15/year |
| SSL (Let's Encrypt) | $0 |
| **Total** | **~$12-13/mo** |

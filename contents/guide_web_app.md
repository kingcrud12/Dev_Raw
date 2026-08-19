# Le Guide Complet : Construire et Déployer une Application Web de A à Z

Créer une application web moderne ne s'improvise pas. Au-delà du code, c'est une ingénierie complète qui va de l'esthétique visuelle jusqu'à la configuration des serveurs Linux. 

Dans ce guide extrêmement détaillé, nous allons décortiquer pas à pas la conception de notre plateforme (le blog et son CRM), en respectant l'ordre chronologique de sa création : Design, Architecture, Backend, Frontend, et enfin, le Déploiement complet.

---

## Sommaire
- [1. Le Design : L'Identité Visuelle (Néo-Brutalisme)](#1-le-design-lidentite-visuelle-neo-brutalisme)
  - [A. Les caractéristiques du Néo-Brutalisme](#a-les-caracteristiques-du-neo-brutalisme)
  - [B. Implémentation technique (Tailwind CSS)](#b-implementation-technique-tailwind-css)
- [2. Architecture & Base de Données](#2-architecture-base-de-donnees)
  - [A. L'Architecture Découplée (SPA + API)](#a-larchitecture-decouplee-spa-api)
  - [B. La Base de Données (SQLite)](#b-la-base-de-donnees-sqlite)
- [3. Le Développement Backend (Go + Gin)](#3-le-developpement-backend-go-gin)
  - [A. Le routeur Gin et GORM](#a-le-routeur-gin-et-gorm)
  - [B. Sécurité : JWT, Cookies et CORS](#b-securite-jwt-cookies-et-cors)
- [4. Le Développement Frontend (React + Vite)](#4-le-developpement-frontend-react-vite)
  - [A. Le Rendu du Markdown (Blog)](#a-le-rendu-du-markdown-blog)
  - [B. L'Interface de Rédaction (CRM)](#b-linterface-de-redaction-crm)
- [5. Le Déploiement : De Vercel au Serveur Linux (VPS)](#5-le-deploiement-de-vercel-au-serveur-linux-vps)
  - [A. Déploiement des Frontends (Vercel)](#a-deploiement-des-frontends-vercel)
  - [B. Déploiement de l'API (Serveur VPS Ubuntu)](#b-deploiement-de-lapi-serveur-vps-ubuntu)
  - [Conclusion](#conclusion)

---

## 1. Le Design : L'Identité Visuelle (Néo-Brutalisme)

Avant même d'écrire une ligne de logique, il faut définir l'ADN du projet. Pour se démarquer des designs "Corporate" lisses et arrondis, nous avons opté pour le **Néo-Brutalisme**.

### A. Les caractéristiques du Néo-Brutalisme
Ce style hérité de l'architecture des années 50 se traduit sur le web par des choix radicaux :
- **Bordures nettes et épaisses** (souvent noires).
- **Ombres portées solides** (aucun flou, décalage strict en X et Y).
- **Couleurs contrastées et asymétriques**.

### B. Implémentation technique (Tailwind CSS)
Pour industrialiser ce design sans répéter les classes partout, nous utilisons les calques de Tailwind CSS dans notre `index.css`. Nous créons des classes utilitaires personnalisées :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  /* La fameuse bordure brutalo-minimaliste */
  .neo-border {
    @apply border-[3px] border-on-background;
  }
  
  /* L'ombre solide caractéristique sans flou */
  .neo-shadow-md {
    @apply shadow-[6px_6px_0px_rgba(0,0,0,1)];
  }
  
  /* Animation de clic brutale (le bloc s'enfonce) */
  .neo-shadow-active {
    @apply active:shadow-[0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] transition-all;
  }
}
```
En appliquant `neo-border neo-shadow-md` à un bouton ou une "card", on obtient instantanément cette esthétique frappante.

---

## 2. Architecture & Base de Données

### A. L'Architecture Découplée (SPA + API)
Nous rejetons l'approche monolithique (où serveur et vues HTML sont liés, ex: PHP classique) au profit d'une architecture **découplée** :
1. **L'API Backend :** Fournisseur exclusif de données (JSON).
2. **Le Client Public (`client_web`) :** Consommateur public (Le Blog).
3. **Le CRM Privé (`crm`) :** Consommateur privé pour l'administration.

Séparer le CRM du blog public réduit drastiquement la surface d'attaque. Si le blog est piraté, le code d'administration n'est physiquement pas présent sur le même serveur frontend.

### B. La Base de Données (SQLite)
Pour un blog, SQLite est le choix roi. Pas besoin d'installer un lourd serveur PostgreSQL. SQLite stocke tout dans un unique fichier `blog.db` extrêmement rapide et facile à sauvegarder.

Voici la structure de notre modèle de données en utilisant l'ORM **GORM** (en Go) :

```go
type Content struct {
    gorm.Model           // Injecte ID, CreatedAt, UpdatedAt
    Type        string   `json:"type"`  // "article", "guide", "tutorial"
    Title       string   `json:"title"`
    Description string   `json:"description"`
    ImageUrl    string   `json:"imageUrl"`
    Tags        string   `json:"tags"`
    ReadingTime int      `json:"readingTime"`
}
```

---

## 3. Le Développement Backend (Go + Gin)

Le Backend est le cerveau de l'opération. Nous avons choisi **Go (Golang)**. Compilé, typé statiquement et doté d'une gestion redoutable de la concurrence, Go permet de faire tourner une API capable d'encaisser des milliers de requêtes avec quelques mégaoctets de RAM.

### A. Le routeur Gin et GORM
Le framework **Gin** permet de monter des endpoints REST en quelques lignes :

```go
func main() {
    db, _ := gorm.Open(sqlite.Open("blog.db"), &gorm.Config{})
    db.AutoMigrate(&Content{}) // Crée les tables automatiquement

    r := gin.Default()
    
    // Endpoint public
    r.GET("/api/contents", func(c *gin.Context) {
        var contents []Content
        db.Order("created_at desc").Find(&contents)
        c.JSON(200, contents)
    })

    r.Run(":8080")
}
```

### B. Sécurité : JWT, Cookies et CORS
L'authentification ne repose pas sur les sessions côté serveur (trop lourd), mais sur les **JSON Web Tokens (JWT)**.

Lors de la connexion dans le CRM, l'API génère un JWT signé et l'injecte dans un **Cookie sécurisé**. Comme le CRM et l'API seront hébergés sur des domaines différents, le cookie nécessite une configuration très stricte :

```go
// Création du cookie inter-domaines
c.SetCookie(
    "auth_token", 
    tokenString, 
    3600 * 24, // Expiration
    "/",       // Path global
    "",        // Laisse le navigateur déduire le domaine
    true,      // Secure : IMPÉRATIF (ne passe qu'en HTTPS)
    true,      // HttpOnly : Protège contre l'interception par XSS
)
// L'attribut SameSite=None doit aussi être configuré sur le reverse proxy ou via la librairie standard.
```

Le **CORS** (Cross-Origin Resource Sharing) est configuré pour bloquer quiconque n'est pas autorisé :
```go
config := cors.DefaultConfig()
config.AllowOrigins = []string{"https://monblog.vercel.app", "https://moncrm.vercel.app"}
config.AllowCredentials = true // Indispensable pour autoriser les cookies
r.Use(cors.New(config))
```

---

## 4. Le Développement Frontend (React + Vite)

Le Frontend est la vitrine. Construit avec **React** et compilé à la vitesse de l'éclair par **Vite**, il fonctionne comme une Single Page Application (SPA).

### A. Le Rendu du Markdown (Blog)
Le contenu venant de l'API est brut. Nous utilisons `react-markdown` pour le transcrire en HTML, tout en appliquant notre fameux design Néo-Brutaliste aux composants générés :

```tsx
<ReactMarkdown 
  rehypePlugins={[rehypeRaw]} // Autorise l'injection d'IFrames YouTube (HTML brut)
  components={{
    h1: ({node, ...props}) => <h1 className="font-headline-lg font-bold border-b-[3px] border-black pb-2 mb-4" {...props} />,
    code: ({node, inline, ...props}) => (
      inline 
        ? <code className="bg-surface-variant px-1 border-[2px] border-black font-bold" {...props} /> 
        : <pre className="bg-black text-white p-4 overflow-x-auto shadow-md" {...props} />
    )
  }}
>
  {article.description}
</ReactMarkdown>
```

### B. L'Interface de Rédaction (CRM)
Le CRM contient une logique complexe pour manipuler le texte (Mise en gras, H1, Code). Pour éviter les bugs de sélection (le curseur qui saute à la fin quand on clique sur un bouton), nous contournons les faiblesses du navigateur en traquant la sélection native :

```tsx
useEffect(() => {
  const handleSelectionChange = () => {
    if (document.activeElement === textareaRef.current) {
      selectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      };
    }
  };
  document.addEventListener('selectionchange', handleSelectionChange);
  return () => document.removeEventListener('selectionchange', handleSelectionChange);
}, []);
```

---

## 5. Le Déploiement : De Vercel au Serveur Linux (VPS)

C'est la phase finale et la plus critique. L'infrastructure est hybride : Serverless pour le front, Serveur dédié pour le back.

### A. Déploiement des Frontends (Vercel)
Les applications React sont hébergées sur Vercel, connectées directement à notre dépôt GitHub. 

**Le piège des SPA :** En React, il n'y a qu'un seul fichier `index.html`. Si un utilisateur rafraîchit la page `/tutoriels`, Vercel cherchera un fichier `tutoriels.html` et renverra une erreur 404.
Pour corriger ça, il faut placer un fichier `vercel.json` à la racine de chaque front :
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### B. Déploiement de l'API (Serveur VPS Ubuntu)

L'API Go doit tourner 24/7 sur un serveur Linux privé (DigitalOcean, OVH, AWS...).

#### 1. Compilation et Systemd
On compile le binaire Go pour l'architecture du serveur (Linux) :
```bash
GOOS=linux GOARCH=amd64 go build -o api_prod main.go
```
On transfère `api_prod` sur le VPS. Pour s'assurer qu'il tourne en arrière-plan et redémarre si le serveur crash, on crée un service Linux (`/etc/systemd/system/api.service`) :
```ini
[Unit]
Description=Mon API Go
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/api
ExecStart=/var/www/api/api_prod
Restart=always

[Install]
WantedBy=multi-user.target
```
On l'active : `systemctl enable api && systemctl start api`

#### 2. Pointage DNS
Dans le panel de votre hébergeur de nom de domaine (ex: Namecheap, OVH), on crée un enregistrement **A (Adresse)** pour le sous-domaine de l'API :
- **Host :** `api`
- **Valeur :** L'adresse IP publique de votre VPS (ex: `198.51.100.23`).

#### 3. Reverse Proxy : Nginx
Exposer l'application Go directement sur le port 80 est dangereux et rigide. Nous utilisons **Nginx**. Il réceptionnera le trafic web et l'acheminera en interne vers le port `8080` de Go.

Fichier `/etc/nginx/sites-available/api` :
```nginx
server {
    server_name api.monblog.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. Génération du Certificat SSL (Certbot)
Sans HTTPS, les navigateurs bloqueront les cookies `Secure` et le navigateur affichera "Non Sécurisé". Nous utilisons **Let's Encrypt** via l'outil `certbot`.

Sur le VPS :
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
# Génère le certificat et modifie Nginx automatiquement !
sudo certbot --nginx -d api.monblog.com
```
Certbot va modifier le fichier Nginx pour forcer la redirection vers le port 443 (HTTPS) et configurer les chemins vers les clés cryptographiques générées.

### Conclusion

Félicitations. En maîtrisant cette pile complète (Design System brut, architecture découplée, Backend Go de haute volée, Frontend réactif et configuration système Linux/Nginx), vous n'êtes plus un simple développeur web : vous êtes un véritable ingénieur logiciel capable de bâtir des plateformes robustes de bout en bout.

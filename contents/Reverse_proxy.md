# Compétences informatiques

## A - Mettre en place un reverse proxy sécurisé avec Nginx

Pour bien comprendre ce que l'on fait, voici quelques définitions simples :

- **Nginx** joue le rôle de "standardiste" : il écoute tout le trafic internet public et le redirige vers le bon programme interne (dans votre cas, une API Go).

- **Un Reverse Proxy Nginx** : Expose publiquement Nginx (sur les ports `80` et `443`) pour qu'il masque et protège votre véritable application qui tourne "cachée" sur un port interne (le port `8087`).
- **Let's Encrypt / Certbot** : C'est l'autorité de sécurité qui vous délivre le fameux "cadenas vert" (HTTPS/SSL) pour chiffrer les données de vos utilisateurs.

---

### 🛠 Les 4 Étapes Clés à Retenir (Cheatsheet)

#### 1. Créer le fichier de configuration (sites-available)
Les fichiers qui définissent les sites web vivent dans le dossier `sites-available`. Pour créer le vôtre, tapez :
```bash
sudo nano /etc/nginx/sites-available/api-blog.neo-tech-softwares.com.conf
```

#### 2. Activer le site (sites-enabled)
Pour que Nginx prenne en compte votre site, il faut créer un "lien symbolique" (c'est-à-dire un simple raccourci) vers le dossier des sites actifs (`sites-enabled`).
```bash
sudo ln -s /etc/nginx/sites-available/api-blog.neo-tech-softwares.com.conf /etc/nginx/sites-enabled/
```

#### 3. Vérifier et Redémarrer (IMPORTANT )
Ne redémarrez **jamais** Nginx sans avoir testé la syntaxe avant ! Si vous avez fait une erreur de frappe, tous les sites de votre serveur risquent de tomber en panne.

```bash
# 1. Tester la syntaxe (doit vous répondre "syntax is ok")
sudo nginx -t

# 2. Redémarrer Nginx en douceur
sudo systemctl reload nginx
```

#### 4. Sécuriser avec le Cadenas Vert (HTTPS)
Une fois que le site répond normalement sur le port 80 (HTTP basique), on utilise le robot **Certbot** pour générer les certificats SSL et forcer la redirection vers HTTPS.
```bash
sudo certbot --nginx -d api-blog.neo-tech-softwares.com
```

---

### Comprendre la syntaxe du fichier de configuration Nginx

Ne soyez pas intimidé par le code. Voici l'anatomie d'un fichier Nginx robuste, expliqué bloc par bloc de façon très simple :

#### 1. Configuration globale et sécurité
```nginx
server {
    server_name api-blog.neo-tech-softwares.com;
    server_tokens off;
}
```
- **`server_name`** : Le domaine (ou sous-domaine) auquel ce serveur doit répondre.
- **`server_tokens off`** : Masque la version exacte de Nginx dans les en-têtes HTTP. C'est une sécurité de base pour éviter que les pirates sachent quelle version vous utilisez.

#### 2. Les boucliers de sécurité (Headers)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
```
Ces boucliers protègent le navigateur de vos utilisateurs :
- **HSTS (`Strict-Transport-Security`)** : Oblige le navigateur à utiliser **uniquement** le HTTPS sécurisé pendant un an.
- **`X-Frame-Options`** : Empêche un autre site d'afficher votre API dans une `<iframe>` (protection contre le vol de clics, appelé Clickjacking).
- **`X-Content-Type-Options`** : Empêche les scripts malveillants de se faire passer pour de simples images.

#### 3. Masquer la technologie backend
```nginx
proxy_hide_header X-Powered-By;
proxy_hide_header Server;
```
Cela empêche votre backend (votre API) d'envoyer des informations qui révèlent le langage ou le framework que vous utilisez. Moins on en dit, mieux cest !

#### 4. Le Reverse Proxy (Le cœur de l'API)
```nginx
location / {
    proxy_pass http://localhost:8087;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
- **`proxy_pass`** : C'est ici que la magie opère ! Nginx prend tout le trafic entrant et le transfère vers votre API interne cachée sur le port `8087`.
- **`proxy_set_header`** : Puisque Nginx joue le rôle d'intermédiaire, l'API Go pourrait croire que tout le monde se connecte depuis "localhost". Ces lignes permettent à Nginx de transmettre la **véritable** adresse IP de vos utilisateurs à votre API.

#### 5. La Redirection HTTP vers HTTPS (Géré par Certbot)
```nginx
server {
    listen 80;
    server_name api-blog.neo-tech-softwares.com;
    return 301 https://$host$request_uri;
}
```
Ce petit bloc attrape tous les visiteurs qui arrivent sur le port 80 non sécurisé (HTTP) et les redirige de façon permanente (le code `301`) vers l'équivalent ultra-sécurisé en `https://`. (Note : Certbot ajoute souvent ce bloc pour vous automatiquement !)
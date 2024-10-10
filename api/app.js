const express = require('express');
const promClient = require('prom-client');
const app = express();

// Configuration de prom-client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics(); // Collecte des métriques par défaut comme la mémoire, le CPU, etc.

// Crée un compteur pour suivre le nombre de requêtes HTTP
const httpRequestCounter = new promClient.Counter({
  name: 'node_api_http_requests_total',
  help: 'Nombre total de requêtes HTTP traitées par l\'API Node.js',
  labelNames: ['method', 'route', 'status'],
});

// Middleware pour incrémenter le compteur de requêtes HTTP à chaque requête
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Endpoint /metrics pour exposer les métriques à Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Une route simple pour vérifier le bon fonctionnement de l'API
app.get('/', (req, res) => {
  res.send('Hello, World! This is your Node.js API running in Docker.');
});

// Démarrer le serveur sur le port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

# Subscription-Tracking-API

<!-- analyze code -->

[dotenv@17.2.0] injecting env (10) from .env.development.local (tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' })       
[dotenv@17.2.0] injecting env (2) from .env.production.local (tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] })
Server is running on http://localhost:3000
MONGODB IS SUCCESSFULLY CONNECTED TO development MODE
body {
  name: 'Capcut Premium',
  price: 789.99,
  currency: 'USD',
  frequency: 'yearly',
  category: 'entertainment',
  startDate: '2025-07-28',
  paymentMethod: 'Credit Card'
}
TypeError: fetch failed
    at node:internal/deps/undici/undici:13510:13
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async HttpClient.requestWithBackoff (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/node_modules/@upstash/qstash/chunk-SSGARCU5.mjs:264:20)
    at async HttpClient.request (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/node_modules/@upstash/qstash/chunk-SSGARCU5.mjs:222:26)
    at async Client.batch (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/node_modules/@upstash/qstash/chunk-SSGARCU5.mjs:1329:22)
    at async triggerFirstInvocation (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/node_modules/@upstash/workflow/chunk-TGEGSOSN.mjs:858:21)
    at async Client.trigger (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/node_modules/@upstash/workflow/index.mjs:251:20)
    at async createSubscription (file:///C:/Users/AAYUS/OneDrive/Desktop/Subscription-Tracking-API/controllers/subscriptioncontroller.js:12:35) {
  [cause]: Error: connect ECONNREFUSED 127.0.0.1:8080
      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1611:16) {
    errno: -4078,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 8080
  }
}
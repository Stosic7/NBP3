# Napredne Baze Podataka - Uputstvo za pokretanje projekta "TechStock"

Ovaj dokument predstavlja kompletno, korak-po-korak uputstvo za konfiguraciju, pokretanje i inicijalizaciju projekta **"TechStock"**. Web aplikacija omogućava kompanijama koje prodaju polovnu/refurbished IT opremu (laptopovi, telefoni, komponente) da upravljaju zalihama, evidentiraju prodaju, filtriraju po statusu/tipu i prate profit kroz interaktivni dashboard.

Sistem koristi **MongoDB Atlas** kao NoSQL bazu podataka, **Node.js/Express** backend i **React** frontend.

---

## 1. Sistemski preduslovi i instalacija softvera

### 1.1. Instalacija Node.js okruženja

Node.js (verzija 18+ LTS) je neophodan za backend i frontend.

Posetite [nodejs.org](https://nodejs.org), preuzmite LTS verziju i instalirajte.

Proverite instalaciju:
```bash
node -v
npm -v
```

Korak 1: Kloniranje i pozicioniranje
```bash
git clone <tvoj-repo-url>
cd techstock
```

Korak 2: Backend setup (server folder)
```bash
cd server
npm install
```

Korak 3: Kreirajte .env fajl u server folderu:
```bash
MONGODB_URI=mongodb+srv://thetwix7_db_user:ZBBll62OUGzJVT8y@nb3.jmi9hr4.mongodb.net/nbp3?retryWrites=true&w=majority&appName=NB3
PORT=5001
NODE_ENV=development
```

Pokretanje backend-a:
```bash
npm run dev    # Development sa nodemon (hot reload)
npm start      # Production
```

Korak 4 - FrontEnd Setup - client folder

```bash
cd ..
cd client
npm install
npm start
```


Frontend: http://localhost:3000
Backend: http://localhost:5001





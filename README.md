# hpcl-complaint-system
# HPCL Complaint Management System

A scalable **Event-Driven Backend System** for handling customer complaints with **automatic SLA monitoring and escalation**.

This project demonstrates a **distributed backend architecture** using modern technologies like **PostgreSQL, Redis, Kafka, and Node.js**.

---

## 🚀 Features

* Complaint creation API
* SLA timer management using Redis
* Automatic complaint escalation
* Kafka event-driven architecture
* Complaint filtering and search APIs
* Admin analytics APIs
* Distributed system design

---

## 🏗 System Architecture

Client
↓
Express API (Node.js)
↓
PostgreSQL → Store complaints
↓
Redis → SLA timers
↓
Redis Expiry Event
↓
Kafka Event (SLA_BREACH)
↓
Kafka Consumer
↓
Complaint Escalation

---

## 🛠 Tech Stack

* **Node.js + Express**
* **PostgreSQL**
* **Redis**
* **Apache Kafka**
* **Docker**
* **REST APIs**

---

## 📂 Project Structure

```
src
 ├── config
 │    ├── db.js
 │    ├── redis.js
 │    └── kafka.js
 │
 ├── routes
 │    ├── complaintRoutes.js
 │    └── adminRoutes.js
 │
 ├── services
 │    ├── kafkaProducer.js
 │    ├── kafkaConsumer.js
 │    └── slaListener.js
 │
 └── server.js
```

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/Anantgautam88/hpcl-complaint-system.git
cd hpcl-complaint-system
```

Install dependencies

```
npm install
```

Start the server

```
node src/server.js
```

---

## 📡 API Endpoints

### Create Complaint

POST /complaints

```
{
 "category": "Gas Leakage",
 "priority": "HIGH",
 "region": "North"
}
```

---

### Get Complaints

```
GET /complaints
```

---

### Get Complaint by ID

```
GET /complaints/:id
```

---

### Resolve Complaint

```
PATCH /complaints/:id/resolve
```

---

### Admin Analytics

```
GET /admin/total-complaints
GET /admin/complaints-by-region
GET /admin/sla-breaches
GET /admin/complaints-by-category
```

---

## ⚡ Event Driven Escalation Flow

1. Complaint created
2. Redis SLA timer started
3. SLA expires
4. Redis expiry event detected
5. Kafka event produced
6. Escalation service processes event
7. Complaint escalated automatically

---

## 🎯 Future Improvements

* Elasticsearch complaint search
* Real-time dashboard
* Multi-level escalation
* Notification system

---

## 👨‍💻 Author

**Anant Gautam**

B.Tech ITE — NIT Srinagar

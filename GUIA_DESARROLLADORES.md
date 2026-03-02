# 📘 Guía para Desarrolladores - AgentERP (IA-Powered)

> **Nota:** Este documento se actualiza automáticamente. Proporciona un índice detallado de las funciones del sistema y sugerencias de optimización de la IA.

## 📋 Índice de Módulos
- [Módulo AUTH](#-módulo-auth)
- [Módulo COMPANIES](#-módulo-companies)
- [Módulo DASHBOARD](#-módulo-dashboard)
- [Módulo FINANCE](#-módulo-finance)
- [Módulo INVENTORY](#-módulo-inventory)
- [Módulo ORGANIZATION](#-módulo-organization)
- [Módulo SYNC](#-módulo-sync)
- [Capa de Datos y DB](#-capa-de-datos-y-base-de-datos)
- [Análisis de IA](#-análisis-de-ia-redundancias-y-optimizaciones)

---

## 📦 Módulo: AUTH
### 📄 actions.ts (`src\modules\auth\actions.ts`)
- **[loginAction](src\modules\auth\actions.ts#L8)**: loginAction - Server Action for user authentication. Pro-Tip: Always use Server Actions for sensitive logic to keep secrets (like DB connection or hashing) on the server.

### 📄 login-form.tsx (`src\modules\auth\login-form.tsx`)
- **[LoginForm](src\modules\auth\login-form.tsx#L15)**: Sin descripción detallada.

### 📄 logout-action.ts (`src\modules\auth\logout-action.ts`)
- **[logoutAction](src\modules\auth\logout-action.ts#L5)**: Sin descripción detallada.

### 📄 password.ts (`src\modules\auth\password.ts`)
- **[isHashedPassword](src\modules\auth\password.ts#L6)**: Sin descripción detallada.
- **[hashPassword](src\modules\auth\password.ts#L10)**: Sin descripción detallada.
- **[verifyPassword](src\modules\auth\password.ts#L16)**: Sin descripción detallada.

### 📄 session.ts (`src\modules\auth\session.ts`)
- **[getCurrentUser](src\modules\auth\session.ts#L4)**: Gets the current logged-in user securely from the session token.

---

## 📦 Módulo: COMPANIES
### 📄 access.ts (`src\modules\companies\access.ts`)
- **[assertCompanyAccess](src\modules\companies\access.ts#L2)**: Sin descripción detallada.

### 📄 actions.ts (`src\modules\companies\actions.ts`)
- **[createCompanyAction](src\modules\companies\actions.ts#L7)**: Sin descripción detallada.
- **[getCompaniesAction](src\modules\companies\actions.ts#L50)**: Sin descripción detallada.
- **[selectCompanyAction](src\modules\companies\actions.ts#L66)**: Sin descripción detallada.

### 📄 add-company-card.tsx (`src\modules\companies\add-company-card.tsx`)
- **[AddCompanyCard](src\modules\companies\add-company-card.tsx#L14)**: Sin descripción detallada.

### 📄 create-company-form.tsx (`src\modules\companies\create-company-form.tsx`)
- **[CreateCompanyForm](src\modules\companies\create-company-form.tsx#L24)**: Sin descripción detallada.
- **[onSuccess](src\modules\companies\create-company-form.tsx#L26)**: Sin descripción detallada.
- **[onSubmit](src\modules\companies\create-company-form.tsx#L46)**: Sin descripción detallada.

### 📄 tenant-bootstrap.ts (`src\modules\companies\tenant-bootstrap.ts`)
- **[bootstrapTenantDatabase](src\modules\companies\tenant-bootstrap.ts#L8)**: Sin descripción detallada.
- **[seedTenantDatabase](src\modules\companies\tenant-bootstrap.ts#L42)**: Seeds the tenant database with initial default data

---

## 📦 Módulo: DASHBOARD
### 📄 sidebar.tsx (`src\modules\dashboard\sidebar.tsx`)
- **[Sidebar](src\modules\dashboard\sidebar.tsx#L60)**: Sin descripción detallada.

### 📄 stats-card.tsx (`src\modules\dashboard\stats-card.tsx`)
- **[StatsCard](src\modules\dashboard\stats-card.tsx#L15)**: Sin descripción detallada.

### 📄 topbar.tsx (`src\modules\dashboard\topbar.tsx`)
- **[Topbar](src\modules\dashboard\topbar.tsx#L26)**: Sin descripción detallada.

---

## 📦 Módulo: FINANCE
---

## 📦 Módulo: INVENTORY
### 📄 actions.ts (`src\modules\inventory\actions.ts`)
- **[createProductAction](src\modules\inventory\actions.ts#L19)**: Sin descripción detallada.
- **[updateProductAction](src\modules\inventory\actions.ts#L56)**: Sin descripción detallada.
- **[recordMovementAction](src\modules\inventory\actions.ts#L100)**: Sin descripción detallada.

### 📄 inventory-stats.tsx (`src\modules\inventory\components\inventory-stats.tsx`)
- **[InventoryStats](src\modules\inventory\components\inventory-stats.tsx#L11)**: Sin descripción detallada.

### 📄 movement-form.tsx (`src\modules\inventory\components\movement-form.tsx`)
- **[MovementForm](src\modules\inventory\components\movement-form.tsx#L39)**: Sin descripción detallada.
- **[loadCached](src\modules\inventory\components\movement-form.tsx#L49)**: Sin descripción detallada.
- **[onSubmit](src\modules\inventory\components\movement-form.tsx#L73)**: Sin descripción detallada.

### 📄 product-form.tsx (`src\modules\inventory\components\product-form.tsx`)
- **[ProductForm](src\modules\inventory\components\product-form.tsx#L40)**: Sin descripción detallada.
- **[onSubmit](src\modules\inventory\components\product-form.tsx#L68)**: Sin descripción detallada.

### 📄 product-list.tsx (`src\modules\inventory\components\product-list.tsx`)
- **[ProductList](src\modules\inventory\components\product-list.tsx#L40)**: Sin descripción detallada.

---

## 📦 Módulo: ORGANIZATION
---

## 📦 Módulo: SYNC
### 📄 actions.ts (`src\modules\sync\actions.ts`)
- **[syncOfflineInvoicesAction](src\modules\sync\actions.ts#L7)**: Server action to synchronize offline invoices. Expects a companyId and a list of offline invoice objects.
- **[syncOfflineMovementsAction](src\modules\sync\actions.ts#L33)**: Server action to synchronize offline inventory movements.

---

## 🗄️ Capa de Datos y Base de Datos

### Esquemas Prisma
- **[Main Schema](prisma/schema.prisma)**: Esquema central de usuarios y empresas.
- **[Tenant Schema](prisma/tenant.prisma)**: Esquema dinámico para cada empresa (Inventario, Ventas, etc.).

---

## 🧠 Análisis de IA (Redundancias y Optimizaciones)

### ✅ Mejoras realizadas recientemente:
- **Unificación de Sucursales**: El método `getBranches` se centralizó en `OrganizationRepository`, eliminando la redundancia en el módulo de empresas.
- **Caché de Conexiones**: Se implementó un pool de clientes Prisma con estrategia LRU (Limitado a 50) para optimizar memoria y prevenir el agotamiento de sockets en SQLite.

### 🚀 Optimizaciones sugeridas:
1. **Typed Actions**: Migrar los Server Actions para usar `next-safe-action` para validación de tipos más robusta.
2. **Batch Sync**: El proceso de sincronización offline actualmente procesa registros uno a uno. Implementar `createMany` para mejorar el rendimiento notablemente.

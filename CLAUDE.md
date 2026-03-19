# LuxeShoes — Multi-Tenant SaaS Platform

## Project Overview
Plataforma SaaS multi-tenant de e-commerce de lujo para calzado.
Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Stripe (pendiente).

Cada cliente (tenant) tiene su propia tienda pública en `/{slug}` y su propio panel admin en `/admin`.
El dueño de la plataforma tiene un panel global en `/superadmin`.

## Commands

```bash
cd front-ecommerce && npm run dev        # http://localhost:3000
```

Strapi eliminado — backend migrado completamente a Supabase.

---

## Architecture

```
luxeshoes/
├── front-ecommerce/               # Next.js 14 App Router
│   ├── app/
│   │   ├── (store)/               # Landing de la plataforma (lista de tiendas)
│   │   ├── [slug]/                # Tienda pública por tenant
│   │   │   ├── page.tsx           # Home de la tienda
│   │   │   ├── productos/         # Listado de productos
│   │   │   ├── productos/[id]/    # Detalle de producto
│   │   │   ├── carrito/           # Carrito (localStorage)
│   │   │   ├── checkout/          # Checkout para invitados
│   │   │   └── pedido/[orderNumber]/ # Confirmación de pedido
│   │   ├── admin/
│   │   │   ├── login/             # Login compartido (owner + admin)
│   │   │   ├── logout/            # Ruta que borra cookies y redirige
│   │   │   └── (dashboard)/       # Panel protegido por tenant
│   │   │       ├── page.tsx       # Dashboard con KPIs
│   │   │       ├── products/      # CRUD productos
│   │   │       ├── categories/    # CRUD categorías
│   │   │       ├── orders/        # Gestión de pedidos
│   │   │       ├── customers/     # Compradores que compraron en esta tienda
│   │   │       ├── analytics/     # Gráficos de ingresos y ventas
│   │   │       └── settings/      # Configuración de la tienda (store_config)
│   │   ├── superadmin/
│   │   │   ├── login/             # (redirige a /admin/login)
│   │   │   └── (dashboard)/       # Panel del owner de la plataforma
│   │   │       ├── page.tsx       # Dashboard global (todos los tenants)
│   │   │       └── tenants/       # CRUD de tenants + creación de admins
│   │   └── api/
│   │       ├── admin/             # API del panel admin (protegida por cookie)
│   │       │   ├── login/         # POST: auth + set cookies
│   │       │   ├── products/      # POST, PUT, DELETE filtrado por tenant
│   │       │   ├── categories/    # POST, PUT, DELETE filtrado por tenant
│   │       │   ├── orders/[id]/   # PUT status filtrado por tenant
│   │       │   └── settings/      # PUT store_config filtrado por tenant
│   │       ├── superadmin/        # API del owner (verifica role=owner)
│   │       │   └── tenants/       # POST (crea tenant+admin+store_config), PUT, DELETE
│   │       └── store/[slug]/      # API pública de la tienda
│   │           └── orders/        # POST: crear pedido como invitado
│   ├── components/
│   │   ├── admin/                 # Sidebar, Header, ProductForm, CategoryForm, etc.
│   │   ├── superadmin/            # SuperAdminSidebar, SuperAdminHeader, TenantForm
│   │   └── store/                 # AddToCartButton, CartView, CheckoutForm
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts          # Browser client (@supabase/ssr)
│       │   ├── server.ts          # Server client con cookies
│       │   └── admin.ts           # Service role client (bypasa RLS)
│       └── tenant.ts              # getTenantId(): lee token → verifica en DB → retorna tenant_id
```

---

## Roles y Auth

### Roles
| Rol | tenant_id | Acceso |
|-----|-----------|--------|
| `owner` | NULL | `/superadmin` — ve toda la plataforma |
| `admin` | uuid | `/admin` — solo su tienda |

### Flujo de login
1. POST a `/api/admin/login` con email + password
2. Supabase `signInWithPassword` con service role client
3. Verifica en tabla `admins` el rol y tenant_id
4. Setea 3 cookies httpOnly: `admin-token`, `admin-role`, `admin-tenant-id`
5. Redirige: `owner` → `/superadmin`, `admin` → `/admin`

### Cookies
- `admin-token`: JWT de Supabase Auth
- `admin-role`: `'owner'` o `'admin'`
- `admin-tenant-id`: UUID del tenant (solo para admins, no para owner)

### Crear owner en Supabase
1. Auth → Users → Add user → email + password + Auto Confirm
2. Copiar UUID y correr:
```sql
INSERT INTO admins (id, email, full_name, role, tenant_id)
VALUES ('UUID-DEL-USUARIO', 'owner@luxeshoes.com', 'Platform Owner', 'owner', NULL);
```

### Crear admin de tenant
Desde `/superadmin/tenants/new` — el formulario crea automáticamente:
- Registro en `tenants`
- Usuario en Supabase Auth
- Registro en `admins` con role='admin' y tenant_id
- Registro en `store_config`

---

## Database (Supabase)

### Tablas principales
| Tabla | Descripción |
|-------|-------------|
| `tenants` | Cada negocio cliente de la plataforma |
| `admins` | Admins por tenant + owner (tenant_id=NULL) |
| `store_config` | Config visual de cada tienda (nombre, logo, banner, etc.) |
| `categories` | Categorías por tenant |
| `products` | Productos por tenant |
| `product_variants` | Variantes de producto (talle, color, etc.) |
| `buyers` | Compradores globales (cuenta opcional, referencia a auth.users) |
| `orders` | Pedidos por tenant (puede ser invitado o buyer registrado) |
| `order_items` | Items de cada pedido |

### Reglas críticas
- **TODAS las queries** filtran por `tenant_id` — nunca mezclar datos entre tenants
- `admins` tabla tiene **RLS DESACTIVADO** — se accede con service role key
- `buyers` es global — no tiene `tenant_id`
- `shipping_address` en orders es **jsonb** `{address, city, province, phone}`
- `subtotal` es NOT NULL en orders — siempre pasarlo igual al `total` si no hay descuentos

### Clientes Supabase
- `createClient()` → server client con anon key + cookies (para tienda pública)
- `createAdminClient()` → service role, sin session persistence (para admin panel y API routes)
- `createAdminClient()` es **síncrono** — nunca `await createAdminClient()`

---

## Multi-Tenancy

- Cada tenant tiene un `slug` único → su tienda pública en `/{slug}`
- El carrito se guarda en localStorage con key `cart_{slug}` — separado por tienda
- Los pedidos de invitados no requieren cuenta — solo nombre, email y dirección
- `getTenantId()` en `lib/tenant.ts` verifica el token y retorna el tenant_id del admin logueado

---

## CSS / Tailwind

- PostCSS config: `postcss.config.js` (CommonJS, NO .mjs)
- Tailwind config: `tailwind.config.ts` con `darkMode: ["class"]`
- `globals.css` importado en `app/layout.tsx`
- Admin y store usan colores explícitos (`bg-zinc-950`, `text-white`) — no dependen de dark mode class
- Si el CSS no carga: borrar `.next/` y reiniciar `npm run dev`

---

## Design Guidelines

### Estética
- Minimalista y de lujo — inspirada en Bottega, Loro Piana, The Row
- Paleta: negro (`zinc-950`), blanco, zinc escala — sin colores estridentes
- Tipografía: Urbanist (Google Fonts), limpia, con peso visual
- Espaciado generoso — el espacio en blanco es parte del diseño

### Componentes
- Server Components por defecto — solo `"use client"` para interactividad
- shadcn/ui como base
- Animaciones sutiles (150-300ms)
- Mobile-first: 1 col → 2 col tablet → 3-4 col desktop

---

## Naming Conventions

- **Componentes**: PascalCase → `ProductCard.tsx`
- **Hooks**: camelCase con `use` → `useProducts.ts`
- **API routes**: kebab-case → `app/api/products/route.ts`
- **Variables/funciones**: camelCase
- **Constantes globales**: UPPER_SNAKE_CASE
- **Tipos/Interfaces**: PascalCase → `ProductType`, `CartItem`

---

## Security Rules

- **NUNCA** exponer service role key en el cliente
- **NUNCA** confiar en datos del cliente — validar en API routes
- Admin panel verificado con `admin-token` cookie en cada request
- Superadmin API verifica `admin-role === 'owner'`
- Tenant isolation: todas las queries con `.eq('tenant_id', tenantId)`
- `.env.local` nunca se commitea

---

## Error Handling

- Errores de UI: mensaje amigable, nunca stack traces
- API routes: código HTTP correcto + `{ error: message }`
- Loading states: skeleton o spinner siempre
- Empty states: mensaje útil siempre

---

## Commit Style

```
feat: agregar checkout para invitados
fix: corregir CSS no cargaba en dev mode
chore: instalar autoprefixer
style: dark mode en panel admin
refactor: extraer getTenantId a lib/tenant.ts
```

---

## Pendiente

- [ ] Stripe integration para pagos reales
- [ ] Subida de imágenes (Supabase Storage)
- [ ] Cuenta de compradores (registro/login de buyers)
- [ ] Deploy en Vercel con env vars correctas
- [ ] Dark mode toggle en tiendas públicas

# Loclen Backend

Đây là dự án Backend được xây dựng dựa trên [NestJS](https://nestjs.com/), sử dụng **Prisma ORM** và tuân theo triết lý **Clean Architecture** / **Domain-Driven Design (DDD)**. Dự án được cấu hình để kết nối với cơ sở dữ liệu PostgreSQL (Supabase) và đi kèm các công cụ hiện đại như **Vitest** (cho testing) và **Oxlint** (cho linting siêu tốc).

## 🏗 Cấu trúc thư mục (Architecture)

Toàn bộ logic của ứng dụng nằm trong thư mục `src/`, được tổ chức thành các lớp (layers) rõ ràng:

- **`src/core/`**: Chứa các interface cốt lõi, Exception tùy chỉnh, và các Ports (theo mô hình Hexagonal / Clean Architecture). Lớp này không phụ thuộc vào bất kỳ framework nào bên ngoài.
- **`src/modules/`**: Nơi chứa các tính năng (Domains) chính của ứng dụng (ví dụ: `auth`, `users`). Mỗi module thường được chia thành:
  - `presentation/`: Controllers để xử lý HTTP request / response.
  - `application/`: Use cases (Services) chứa logic nghiệp vụ của ứng dụng.
  - `domain/`: Entities và Value Objects chứa logic nghiệp vụ thuần túy nhất.
  - `infrastructure/`: Implementations cho các interface/ports (như Repositories truy xuất database).
- **`src/shared/`**: Chứa các utilities, decorators, và filters có thể tái sử dụng ở nhiều module khác nhau.
- **`src/config/`**: Quản lý các biến môi trường và cấu hình ứng dụng.
- **`prisma/`**: Chứa schema định nghĩa Database (`schema.prisma`) và quản lý các migrations.

## 🚀 Cài đặt & Khởi chạy

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc (bạn có thể copy từ `.env.example`) và điền thông tin kết nối Database.

**Lưu ý với Supabase:** 
Bạn cần cấu hình 2 đường dẫn trong file `.env` (Sử dụng Connection Pooler IPv4):
```env
# Dùng cho ứng dụng chạy (cổng 6543)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[POOLER_URL]:6543/postgres?pgbouncer=true"

# Dùng để chạy lệnh Prisma CLI (cổng 5432)
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

PORT=3000
NODE_ENV=development
```

### 3. Đồng bộ Database (Prisma)
Sau khi thiết lập file `.env`, hãy đẩy cấu trúc schema lên Database:
```bash
# Push schema trực tiếp (phù hợp lúc đang code/dev)
npx prisma db push

# Hoặc dùng migration nếu đã golive
npx prisma migrate dev

# Khởi tạo Prisma Client
npx prisma generate
```

### 4. Khởi chạy ứng dụng
```bash
# Chế độ phát triển (Tự reload khi đổi code)
npm run start:dev

# Chế độ Production (Cần build trước)
npm run build
npm run start:prod
```

## 🛠 Các lệnh hữu ích (Scripts)

Dưới đây là các lệnh đã được thiết lập sẵn trong `package.json`:

- `npm run lint`: Kiểm tra lỗi code siêu tốc bằng **Oxlint**.
- `npm run format`: Format lại code bằng **Prettier**.
- `npm run test`: Chạy toàn bộ Unit test với **Vitest**.
- `npm run test:watch`: Chạy Unit test ở chế độ theo dõi sự thay đổi (watch mode).
- `npm run test:e2e`: Chạy End-to-End test.

## 🐳 Docker
Dự án đã có sẵn `Dockerfile` và `.dockerignore`. Bạn có thể dễ dàng đóng gói ứng dụng:
```bash
# Build image
docker build -t loclen-backend .

# Hoặc dùng docker-compose
docker-compose up -d
```

# Sử dụng image nodejs phiên bản 14.16.1
FROM node:18.15.0

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào trong container
COPY package*.json ./

# Cài đặt các package dependencies
RUN npm install

# Sao chép toàn bộ code vào trong container
COPY . .

# Thiết lập cổng để ứng dụng lắng nghe
EXPOSE 8080

# Khởi chạy ứng dụng NestJS
CMD ["npm", "run", "start"]

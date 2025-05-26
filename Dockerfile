# Sử dụng Node.js LTS version làm base image
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose port 3000
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["npm", "start"] 
FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3002

# Comando para iniciar a aplicação
CMD ["npm", "start"] 
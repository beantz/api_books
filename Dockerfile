FROM node:18
#vai executar os comandos seguintes na pasta definida abaixo
WORKDIR /api_node

#copia apenas o necessário para instalação
COPY package*.json ./
RUN npm install --production

#copia todo o restante do projeto
COPY . .

#porta da API
EXPOSE 3000

CMD ["node", "Index"]

# 2020.2 Eccoar Relatórios Service

Este serviço é referente ao serviço de Relatórios.
Para poder utilizá-lo, certifique de que você possui o [Docker](https://www.docker.com/) e o 
[Docker Compose](https://docs.docker.com/compose/) em sua máquina.
Caso contrário será necessário baixá-los. Para isso basta seguir os links:

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

Para rodar o projeto, basta executar o seguinte comando na raíz:
```
docker-compose up --build
```

Para executar os testes basta rodar:
```
docker run 20202-20202-eccoar_reports_backend_reports npm run test
```

Para executar o lint rode:
```
docker run 20202-20202-eccoar_reports_backend_reports npm run lint
```

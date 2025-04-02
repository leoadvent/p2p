# PROJETO - EXPO MONEY
## Setup do ambiente de desenvolvimento

Este projeto utiliza:

### Containers
	* Postgres
	* Keycloak	

### Tecnologias
	* Docker
 	* Java 17
	

### Execução

Acesse a pasta **docker/API_EXPO_MONEY**, na raiz do repositório e execute o comando abaixo para iniciar os containers:

``` shell
docker-compose up -d
``` 

### Configurando KEYCLOAK
Após a execução do docker compose, o keycloak estará disponivel em http://localhost:8090/ durante a execucao do docker, serao criados o REALM, CLIENTE, ROLES e um usuario padrao, para saber mais sobre criação de realm veja nesse [link](https://www.keycloak.org/docs/latest/server_admin/index.html#configuring-realms)

### SWAGGER-UI
O projeto disponibiliza a documentação swagger-ui, onde é possivél recuperar todos os endpoints e entidades presente no projeto
{URL}/rest/swagger-ui/index.html

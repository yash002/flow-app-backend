Setup DB:

docker run --name flow-app -e POSTGRES_DB=flow-app -e POSTGRES_PASSWORD=password -v $HOME/code/flow-app/data:/var/lib/postgresql/data:z -p 5432:5432 -d postgres:13-alpine

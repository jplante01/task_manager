#### Build the docker image locally
`docker build -t task-manager-app .`

#### Run the docker container from the image
`docker run -p 3000:80 --env-file .env.local task-manager-app`

##### Run the docker container from the image INTERACTIVELY to see errors
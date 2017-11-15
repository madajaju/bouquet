# Bouquet uService (Micro-service)

A `bouquet-uservice` generator for use with the Sails command-line interface. 
It generates new uservices using a convention over configurability pattern


## Installation

```sh
$ npm install sails-generate-bouquet-uservice --save
```

Then merge the following into your `.sailsrc` file:

```json
{
  "modules": {
    "bouquet-uservice": "sails-generate-bouquet-uservice"
  }
}
```

## Usage

```bash
$ sails generate bouquet-uservice <uservice-name> 
```

## Bouquet uService Pattern
I have been developing applications with uServices for sometime. Each time I wrote a new application I could not
figure out where to put the uService Definitions. They tended to be spread all over my source tree. Since I was 
writing my application using [sailsjs](http://www.sailsjs.org) I wanted to follow the convention over configurability
paradigm that they espouse in sails.

Here are some of the things that I tried.
* api/workers directory - Using the sails_hook_publisher & sails_hook_subscriber
* api/jobs directory - similar to the workers pattern but using grunt to run processes.
* deploy directory - Using the micro npm module.

### Workers
This method uses the sails_hook_publisher & sails_hook_subscriber plugins to give each instance the ability to subscribe
to jobs that are are requested from another service. It assumes that you are using redis as the message queue. And it does
not handle the management of starting/stopping or replicating services. It is a good solution but it had the overhead of
a full sails application with each worker. It also tied the logical to the deployment models too tightly for me.

### Jobs
Very similar to the publish/subscribe worker paradigm but I wanted a light weight mechanism for spinning up small services
without all of the overhead of the sails stack. So I basically just fired up small node js scripts that I stored in
the jobs directory. Problems with this is lack of flexibility of the micro-service architecture and coupling with the
application code.

### Deploy
Using the [micro npm package](https://www.npmjs.com/package/micro) to create simple micro services that can handle a 
HTTP request. I created simple micro services that performed specific tasks for the application. Creating the micro 
services was actually very simple thanks to the [micro](https://www.npmjs.com/package/micro) package. But Deploying
multiple micro services can be hard manage. So I looked to docker and containers to help with this.

I had to come up with a strategy to define/code my microservices, how they would be managed and deployed. I had
to remember the key software engineering principles of Cohesion, Decoupling and Reuse in my architecture. So the first
thing I worked on was decoupling the microservice deployment from the microservice source code itself.

This gave me the flexibility to change my deployment architecture from source code itself. To do this I looked at 
defining my deployment architecture using docker both DockerFile and docker compose file formations. To define a microservice
I had to do the following.
* create a package.json file with all of the packages needed to run my microservice
* create a Dockerfile to build the image of my microservice
* add the microservice to a docker-compose file for the application.

### package.json
The package.json file contains the npm packages that my microservice depends on as well as an scripts that are needed
to manage my microservice including a build and deploy script. Note that when I build my microservice image I tag it
with a local registry service using "localhost:5000/appName/userviceName" where appName is the name of the application
and userviceName is the name of the microservice that I am creating. This is just an example of a naming convention that
I like to use. If I was creating a microservice that I was going to use over and over again I would use a different name.
The deploy target pushes the image into the local registry so I can use the image in the docker swarm that I am running.
```json
 {
  "main": "index.js",
  "scripts": {
    "start": "micro",
    "build": "docker build . -t localhost:5000/appName/userviceName",
    "deploy": "docker push localhost:5000/appName/userviceName"
  },
  "dependencies": {
    "micro": "latest",
    "node-fetch": "latest"
  }
} 
```
### Dockerfile
The dockerfile in this case is very simple. I am writing all of my micro-services in node so I start with the base image.
Next I simply copy the package.json file to an application directory and I copy any of the source code into the application
directory. Then I call "npm install" this will install all of the packaging that are required by my micro-service for
the image. Then the last statement launchs the microservice by calling "npm start".
```
FROM  node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD npm start
```

### docker-compose.yaml
The docker-compose.yaml file contains the services and their deployment configurations for the application.
For my application I have a simple web server that is the main microservice for my application. It is a sailsjs application.
I try to always name my web interface micro-service "web". It is easy for me to find them later. Again in the file below
I have appName as the name of the application. Also you can see the micro-service definition is runing 5 replicas and
the image is the same one as defined in the Dockerfile above.

```yaml
version: '3'

services:
  mongo:
    image: mongo
    expose:
         - 27017
    ports:
         - "27017:27017"
  appName:
    image: localhost:5000/appName/web
    expose:
      - 1337
    ports:
      - "1337:1337"
  userviceName:
    image: localhost:5000/appName/userviceName
    deploy:
            mode: replicated
            replicas: 5
```


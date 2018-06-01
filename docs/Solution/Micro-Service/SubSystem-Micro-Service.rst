.. _SubSystem-Micro-Service:

Micro-Service
=============

Micro-Service represents a micro-service that is being developed to implement the system.
Bouquet helps with the implmentation and documentation of micro-services through re-usable templates in the sails
framework. These template combined with the conventions in the sails framework accelerates the design and deployment
of micro-services.

Generated Artifacts
-------------------
There are several artifacts that are generated when using bouquet for micro-service generation. The artifacts can be
grouped into two categories: deployable and documentation.

Deployment artifacts are used when deploying the application. They consist of deployment manifests for multiple
environments (dev, test, production). The deployment manifests show how all of the micro-services are deployed
and their relationships between them. In the current implementation the "Docker Compose" file format is used.

Additionally for each micro-service a directory is created. And three "starter" files are added to the directory.
The convention that I have chosen is Docker, and "micro" nodejs for the development and deployment of micro-services.
As a result a standard Dockerfile is created and a simple index.js file is created following standard micro examples.
Lastly a package.json file is created to help automate the building and deploying of the microservice.

.. image:: DeployArtifacts.png

The documentation of the micro-services follows the other bouquet documentation conventions. Bouquet puts micro-service
documentation into the Solution directory under a Services directory. Each new micro-service has its own directory and
populates it with some uml files and a standard template for documentation.

.. image:: DocArtifacts.png


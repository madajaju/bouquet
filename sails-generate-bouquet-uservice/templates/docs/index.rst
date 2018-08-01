.. _Service-<%= name %>:

<%= name %>
<%= "=".repeat(name.length) %>

<%= name %> is a micro-service of <%= projectName %> ...

Use Cases
---------

*

.. image:: UseCases.png

Users
-----

* :ref:`Actor-User`

.. image:: UserInteraction.png

Uses
----

* :ref:`Service-<%= name %>`

Interface
---------

* CLI - Command Line Interface
* REST-API -
* Portal - Web Portal

Logical Artifacts
-----------------

*

.. image:: Logical.png

Activities and Flows
--------------------

.. image::  Process.png

Deployment Architecture
-----------------------

This is the deployment of the micro-service.
The micro-service is deployed when *trigger* and should scale from *# to #* based on *condition*.
The micro-service is deployed with the *imagename* image.
The ports exposed are 5000 for external and 3000 for internal.

.. image:: Deployment.png

Physical Architecture
---------------------

The micro-services are physically deployed on to a hybrid cloud infrastructure.

.. image:: Physical.png


#Florist
In the 1990s I started dabbling with a new kind of system analysis.
Object Oriented Ssystem Analysis. I quickly became familiar with all of the great OOA/D tools.
The one that stood out for me was Rational Rose. I dove right in and over time became quiet preficent in using the tool.
I quickly started writing scripts to to make my life easier and automate repeated tasks.
This was the birth of a project named Florist. 
 
Move forward 20 years. I am still using UML to design and architect systems, but I also use
rapid prototyping technologies like sails, rails and grails. Most recently I am focusing on
nodeJS/sails development. I dusted off my old Florist specs and started working on resurrecting
Florist with the latest technologies.

These are the technologies that I am leveraging this time.

* PlantUML - Textual way of describing UML diagrams
* SailsJS - MVC framework for NodeJS development
* Commander - npm module for command line programming for NodeJS
* GitHub MD - Markdown language for projects in GitHub.


The tools by themselves are very useful. Bringing all the tools together is where I found the most benefit.

##PlantUML

PlantUML is a component that lets you quickly write several UML diagrams using Text instead of a drawing tool. It is great for many but not all of the UML diagrams. I have found that it covers everything that I typically need to do for Architectures of systems. UseCase, Component, Class, Deployment, Scenarios, and Activity Diagrams. 

One of the benefits of using PlantUML that the text files that your create (*.puml) can be checked in to GitHub. You can also generate image files (png) from the text files (puml) and check in the image files as well. I do this so my design documents in GitHub (Markdown language is used) can reference the images that have been generated. Generating the image (png) files is as easy as typing in a command line.
```
# java -f design/plantuml.jar myDiagram.puml
```

Because I am using NodeJS. I can use a npm script command to actually generate all of the my images. Basically I put another target in my package.json file in the root directory that searches all of my design directories and generates the png files.
```
  "scripts": {
  ...
  "design": "java -jar design/plantuml.jar design/*.puml design/**/*.puml",
  ...
  }
```

Now you can generate png files for all of your design diagrams, just type.
```
# npm run-script design 
```
To find out more about PlantUML click [here](http://www.plantuml.com)
You can download the latest jar file for quick image generation [here](http://www.plantuml.com/downloads).
There is also a Plugin for PlantUML for [Intellij](http://getlink) and several other IDEs. 

##SailsJS

SailsJS is a MVC convention over configuration framework for NodeJS applications. This uses a common pattern 
that can be found in several programming languages today. Examples include Ruby o Rails, and Groovy on Grails.

##Commander

Commander is a nodejs module for command-line processing. I use this to develop command line interfaces 
for the systems that I architect. This gives me a quick and dirty way of providing a command line interface
with very little lifting.

##GitHub MD

MD - Markdown language is used to quickly and easily document a git hub repository. The language allows
for simple text based documentation to make it quick and easy. 

#Florist

Using the concept of convention over configurability of SailsJS, I extended the same concepts that 
already exist in SailsJS and created a design and bin directory in the project root directory. 
This gives me a place to put the design of the architecture as well as the CLI (Command Line interface)
of the system being architected. This is important because most of the architectures I am working have
a Web, REST and CLI .

##Directory Hierarchy

After a SailsJS project is created a standard directory hierarchy contains several directories and files.
I added two additional directories to the top level (bin, design, and test). Next, I add corresponding
subdirectories in the design directory as shown below.

* api - Standard SailsJS directory
* assets - Standard SailsJS Directory
* **bin** - Contains commander binaries
* config - Stanard SailsJS Directory
* **design** - Contains Architecture and Design of the system
    * Actors - Actors of the system
        * README.md - ReadMe for all of the Actors
        * < Actor Name > - Directory for each Actor of the system
    * UseCases - Use Cases of the system
        * README.md - ReadMe file for all of the UseCases
        * UseCases.puml - PlantUML file for all of the Use Cases and Actors
        * < UseCase Name > - Directory for each Use Case of the system
    * Systems - System Components
        * README.md - ReadMe for all of the sub-systems
        * < Sub System Name > - Directory for each sub system.
    * README.md - Top ReadMe for the Architecture and Design
    * Architecture.puml - Top level architecture plantUML diagram
    * plantuml.####.jar - plantUML jar file used to generate png files.
* tasks - Standard SailsJS Directory
* **test** - Contains test for the system.
    * bin - Test the CLI
    * Actors - Test the Actor interactions One Test Suite per Actor with each use case
    * UseCases - Test the Scenarios as described. One Test Suite per Scenario with tests for each different path through the scenario
    * System - Test of each subsystem. One Test Suite for each SubSystem, a test for each of the interface calls.
* views - Stand SailsJS Directory


##Future 
I know as I start using this I will add more generated artifacts to the system. So if you have any ideas please
let me know. You can find more at the github project 


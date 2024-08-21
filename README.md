# GenStudio Template Editor

This utility uses Gulp to watch the files in this repository and renders the new HTML in order for template authors to see the content generated before uploading it into GenStudio for previewing.

# Topology

Under `src/templates` create a folder with a name the respresents the template you are working on and put two files in the folder, the first one being [template].html and then other [template].json. The value [template] is an aribitrary value it is meant to be replaced with the value of your actual template name.

# Requirements

- Node 20+
- NPM 10+
- Live Server plugin from VSCode

# How to use 

- npm install
- npm run start
- Right click on the generated file and select `Open with live reload`
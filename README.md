# MyAngularTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Generate an embedded app

Run `python create-embedded-app.py [parameters]` to automatically perform all steps needed to integrate an embedded app into the Teiler-Dashboard. 
There are 3 ways to specify the parameters:
- by using the CLI arguments (explained below)
- interactively during the runtime
- both combined

By default, if a parameter is not specified in the CLI a prompt will be created during the runtime.
For required parameters this prompt repeats until an acceptable input is given.
This interactive mode can be turned off by using the `-i` argument, in which case parameters can only be given in the CLI.
- `-n <string>`: The name of the embedded app (required).
- `-t <string>`: The title of the embedded app (default: "").
- `-r <string>`: Roles of the embedded app (default: PUBLIC, choices: PUBLIC, USER, ADMIN). Multiple arguments can be specified here. Example: `-r PUBLIC USER ADMIN`
- `-d <string>`: Description of the embedded app (default: "").<br />
- The app requires an icon, which can **either** be specified by the name of the icon class
  - `-ic <string>`: Icon class of the embedded app.

  or by the URL of the icon source
  - `-is <string>`: URL of the icon for the embedded app.
  
  Exactly one of those must be specified. The other one will default to `undefined`.
- `-i`: Turns off the interactive mode.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Docker
docker build -t teiler-dashboard .
docker run teiler-dashboard -p 8085:80

# Docker-compose
docker-compose build
docker-compose up

# Deploy Development for default language
ng serve --configuration=development

# For developers:
## Internationalization
`ng extract-i18n --output-path src/i18n --format=xlf2`  
After that: Compare messages.en.xlf with the new messages.xlf: Update and add new entries

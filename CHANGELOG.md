# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2025-07-28
### Changed
- Angular 22 (via 20 and 21), TypeScript 6.0, Angular Material 22
- single-spa-angular 22, single-spa 6, zone.js 0.16 (same as the orchestrator)
- angular-auth-oidc-client 22, @swimlane/ngx-charts 25, bootstrap 5.3.8, cldr 49
- Templates use the built-in control flow (@if/@for)
- Docker: node:26-alpine (LTS), npm ci, nginx:1.30-alpine

### Fixed
- Karma tests start again: zone.js and src/assets/env.js are loaded in the test target (in production both are provided at runtime by the orchestrator and the container)

### Removed
- @angular/flex-layout (deprecated, unused)

## [1.0.5] - 2025-06-24
### Removed
- Innecessary Embedded Apps

### Fixed
- User name
- Language routing
- Language bug while login and logout

### Changed
- Embed external libraries
- Angular 18
- Angular 19
- Translations

### Added
- Teiler Backend config for Logo Text and Logo Height
- Deactivate OIDC if OIDC-URL not set
- Styling


## [1.0.4] - 2025-03-04
### Added
- Assets API service
- Default values for docker env for logo, background, color and font

## [1.0.2] - 2024-02-14
### Changed
- OIDC instead of KEYCLOAK

## [1.0.1] - 2023-12-13
### Fixed
- Router link blank and router link

## [1.0.0] - 2023-12-13
### Added
- Init project
- Prototype
- Docker
- Environment variables
- i18n
- environment variables config
- remove nngm
- Adapt to teiler-core Teiler App
- Teiler Core Client
- Route Manager Service
- Single Spa
- TeilerApp Plugin Orchestrator
- external link
- Sort teiler apps
- Keycloak
- Keycloak environment variables
- donwload to configuration component
- Teiler-Box
- reachable frontend and backend
- Separate local from central components
- Teiler Welcome Component
- Quality Report Mockup
- Function Tests
- Event Log
- TeilerEnvironment
- Revert "TeilerEnvironment"
- TeilerEnvironment
- Call env.js in root-config (fix integration with single-spa)
- Only one server pro instance instead pro language for teiler ui and teiler apps.
- environment variables to docker-compose template
- Multi-language
- language selector
- Improve Quality Report UI
- Improve Function Tests UI
- Improve Event Log UI
- Uploads Teiler App
- Inquiries Teiler App
- Archived, Failed and Active Inquiries
- Inquiry
- Inquiry Sarkome Mock-Up
- Generate router link from window.location.pathname instead of router
- Excel export from teiler
- CSV export from teiler
- Docker ignore
- Is export ready
- Dockerignore
- Gitignore
- Default template variable for exporter and reporter
- Central Keycloak configuration based on groups
- KEYCLOAK_TOKEN_GROUP

## Fixed
- Update teiler apps in sidebar
- Login to main site
- i18n
- space after welcome
- Redirect to main if router link not found
- Copy Assets env.js in Docker
- Reporter Cors
- TEILER_USER and TEILER_ADMIN as default values for docker

## CHANGED
- Check for both frontend and backend
- Name: Bridgehead instead of Teiler
- Update Libraries for Keycloak 20
- Update all libraries
- Add http relative path (compatible with traefik)
- Rename developer to develop
- Rename: Teiler Dashboard
- Rename: Teiler Orchestrator and Teiler Dashboard

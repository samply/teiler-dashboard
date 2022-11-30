import subprocess
from os import path
import shutil

# setup
NAME = "mytest"
DESCRIPTION = "my test description"
ICON_CLASS = "bi bi-8-square-fill"
ICON_SOURCE_URL = "undefined"
TITLE = "My Test"
ROLES = "TeilerRole.TEILER_PUBLIC"

root = path.dirname(path.abspath(__file__))

APP = path.join(root, "src", "app")
APP_MODULES = path.join(APP, "app.module.ts")
APP_ROUTING_MODULES = path.join(APP, "route", "app-routing.module.ts")
TEILER = path.join(APP, "teiler")
TEILER_MODULES = path.join(TEILER, "teiler.module.ts")
TEILER_APP = path.join(TEILER, "teiler-app.ts")
TEILER_SERVICE = path.join(TEILER, "teiler.service.ts")
SERVICE_FILE = path.join(APP, f"{NAME}.service.ts")
SERVICE_SPEC_FILE = path.join(APP, f"{NAME}.service.spec.ts")
COMPONENT_FILE = path.join(APP, NAME, f"{NAME}.component.ts")
ROUTE_MANAGER = path.join(APP, 'route', "route-manager.service.ts")

COMPONENT_NAME = ""
SERVICE_NAME = ""
NAME_ENUM = NAME.replace("-", "_").upper()


"""------------------------------
1. Generate service and component
------------------------------"""
print(f"\nGenerate new service {NAME}...")

rt = subprocess.call(['npm', 'run', 'ng', 'g', 's', NAME], cwd=root, shell=True)
if rt:
    print("Generating failed...")
    exit()


print(f"\nGenerate new component {NAME}...")
rt = subprocess.call(['npm', 'run', 'ng', 'g', 'c', NAME], cwd=root, shell=True)
if rt:
    print("Something went wrong")
    exit()


"""-------------------------------------
1.5. Remove Samply from XXX.component.ts
-------------------------------------"""
print(f"\nRemove Samply from {NAME}.component.ts")

with open(COMPONENT_FILE, "r") as file:
    lines = file.readlines()
    for i, line in enumerate(lines):
        if line.find("selector:") != -1:
            lines[i] = line.replace("samply-", "")
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(COMPONENT_FILE, "w") as file:
    file.writelines(lines)


"""----------------------------------------------
2. Move component directory to embedded directory
----------------------------------------------"""
print(f"\nMoving component directory to embedded directory...")

dest_dir = path.join(APP, "embedded", NAME)
if path.isdir(dest_dir):
    shutil.rmtree(dest_dir)
shutil.move(path.join(APP, NAME), path.join(APP, "embedded"))


"""---------------------------------
3. Remove component in app.module.ts
---------------------------------"""
print(f"\nRemoving component in app.module.ts...")

delete_lines = []
found_section = False
import_string = ""

with open(APP_MODULES, "r") as file:
    lines = file.readlines()
    for i, line in enumerate(lines):
        if not found_section and line.find(NAME) != -1:
            COMPONENT_NAME = line[line.find("{ ") + 2: line.find(" }")]
            SERVICE_NAME = COMPONENT_NAME.replace("Component", "Service")
            delete_lines.append(i)
            found_section = True
            continue
        if found_section and line.find(COMPONENT_NAME) != -1:
            delete_lines.append(i)
            lines[i - 1] = lines[i - 1].replace(",", "")
            break
    else:
        print("Could not find the needed lines.")
        exit()
    for i in delete_lines[::-1]:
        import_string = lines.pop(i)

with open(APP_MODULES, "w") as file:
    file.writelines(lines)


"""--------------------------------------
4. Add component to app-routing.module.ts
--------------------------------------"""
print(f"\nAdding component to app-routing.module.ts...")

import_string = import_string.replace("from '.", "from '../embedded")

with open(APP_ROUTING_MODULES, "r") as file:
    lines = file.readlines()
    last_import_line = 0
    for i, line in enumerate(lines):
        if line.find("import") != -1:
            last_import_line = i
            continue
        if line.find("]") != -1:
            lines[i-1] = lines[i-1].replace("\n", ",\n")
            lines.insert(i, f"\t{COMPONENT_NAME}\n")
            lines.insert(last_import_line + 1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(APP_ROUTING_MODULES, "w") as file:
    file.writelines(lines)


"""---------------------------------------
5.	Move service files to teiler directory
---------------------------------------"""
print(f"\nMoving Service Files...")

SERVICE_FILE = shutil.move(SERVICE_FILE, path.join(APP, "teiler"))
SERVICE_SPEC_FILE = shutil.move(SERVICE_SPEC_FILE, path.join(APP, "teiler"))


"""--------------------------------------------
6. Add service to providers in teiler.module.ts
--------------------------------------------"""
print(f"\nAdding service to providers in teiler.module.ts...")

import_string = f'import {{{SERVICE_NAME}}} from "./{NAME}.service";\n'

with open(TEILER_MODULES, "r") as file:
    lines = file.readlines()
    last_import_line = 0
    for i, line in enumerate(lines):
        if line.find("import {") != -1:
            last_import_line = i
            continue
        if line.find("providers:") != -1:
            lines[i] = line.replace("]", f", {SERVICE_NAME}]")
            lines.insert(last_import_line + 1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(TEILER_MODULES, "w") as file:
    file.writelines(lines)


"""---------------------------------------
7. Add EmbeddedTeilerApps in teiler-app.ts
---------------------------------------"""
print(f"\nAdding EmbeddedTeilerApps in teiler-app.ts...")

with open(TEILER_APP, "r") as file:
    lines = file.readlines()
    found_section = False
    for i, line in enumerate(lines):
        if not found_section and line.find("export enum EmbeddedTeilerApps") != -1:
            found_section = True
            continue
        if found_section and line.find("}") != -1:
            lines[i-1] = lines[i-1].replace("\n", ",\n")
            lines.insert(i, f"\t{NAME_ENUM} = '{NAME}'\n")
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(TEILER_APP, "w") as file:
    file.writelines(lines)

"""----------------------------------------------------
8. Extend Service to EbeddedTeilerApp in XXX.service.ts
8.1 Implement properties
8.2 Add EmbeddedTeilerApps to constructor 
----------------------------------------------------"""
print(f"\nExtending Service to EbeddedTeilerApp in XXX.service.ts...")

template = \
f'''\tdescription: string = "{DESCRIPTION}";
\ticonClass: string = "{ICON_CLASS}";
\ticonSourceUrl: string | undefined = {ICON_SOURCE_URL};
\ttitle: string = "{TITLE}";
\troles: TeilerRole[] = [{ROLES}];

\tconstructor(router: Router) {{
    super(EmbeddedTeilerApps.{NAME_ENUM}, router);
\t}}\n'''

import_string = \
'''import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";\n'''

with open(SERVICE_FILE, "r") as file:
    lines = file.readlines()
    found_section = False
    for i, line in enumerate(lines):
        if not found_section and line.find("export class") != -1:
            lines[i] = line.replace("{", "extends EmbeddedTeilerApp {")
            found_section = True
            continue
        if found_section and line.find("constructor") != -1:
            lines[i] = template
            lines.insert(1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(SERVICE_FILE, "w") as file:
    file.writelines(lines)


"""--------------------------------
9. Add service to teiler.service.ts
--------------------------------"""
print(f"\nAdding service to teiler.service.ts...")

import_string = f'import {{{SERVICE_NAME}}} from "./{NAME}.service";\n'

with open(TEILER_SERVICE, "r") as file:
    lines = file.readlines()
    found_section = False
    last_import_line = 0
    for i, line in enumerate(lines):
        if not found_section and line.find("import {") != -1:
            last_import_line = i
        if not found_section and line.find("constructor") != -1:
            found_section = True
            continue
        if found_section and line.find(")") != -1:
            SERVICE_NAME_lower = SERVICE_NAME[0].lower() + SERVICE_NAME[1:]
            lines[i-1] = lines[i-1].replace("\n", ",\n")
            lines[i+1] = lines[i+1].replace("]", f", {SERVICE_NAME_lower}]")
            lines.insert(i, f"\t\t{SERVICE_NAME_lower}: {SERVICE_NAME}\n")
            lines.insert(last_import_line + 1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(TEILER_SERVICE, "w") as file:
    file.writelines(lines)

"""------------------------------------------
10. Add component to route-manager.service.ts
------------------------------------------"""
print(f"\nAdding component to route-manager.service.ts...")

import_string = f'import {{{COMPONENT_NAME}}} from "../embedded/{NAME}/{NAME}.component";\n'
template = f'\t\t{{name: EmbeddedTeilerApps.{NAME_ENUM}, component: {COMPONENT_NAME}}}\n'

with open(ROUTE_MANAGER, "r") as file:
    lines = file.readlines()
    found_section = False
    last_import_line = 0
    for i, line in enumerate(lines):
        if not found_section and line.find("import {") != -1:
            last_import_line = i
        if not found_section and line.find("RouteManagerService") != -1:
            found_section = True
            continue
        if found_section and line.find("].map") != -1:
            lines[i-1] = lines[i-1].replace("\n", ",\n")
            lines.insert(i, template)
            lines.insert(last_import_line + 1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(ROUTE_MANAGER, "w") as file:
    file.writelines(lines)

print("\nSuccess!")
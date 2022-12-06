import subprocess
from os import path
import shutil
import argparse

# Create the parser
parser = argparse.ArgumentParser(prog="create-embedded-app",
                                 description="Creates an embedded app in the Teiler-UI.")

parser.add_argument("-n",
                    dest="NAME",
                    type=str,
                    help="Name of the embedded app (required)",
                    required=True)

parser.add_argument("-t",
                    dest="TITLE",
                    type=str,
                    default="",
                    help="Title of the embedded app (default: '')")

parser.add_argument("-r",
                    dest="ROLES",
                    type=str,
                    nargs="+",
                    default="",
                    choices=['PUBLIC', 'USER', 'ADMIN'],
                    help="Roles of the embedded app (default: PUBLIC)")

parser.add_argument("-d",
                    dest="DESCRIPTION",
                    type=str,
                    default="",
                    help="Description of the embedded app (default: '')")

group_icon = parser.add_mutually_exclusive_group()

group_icon.add_argument("-ic",
                        dest="ICON_CLASS",
                        type=str,
                        default="undefined",
                        help="Icon class of the embedded app (default: undefined)")

group_icon.add_argument("-is",
                        dest="ICON_SOURCE_URL",
                        type=str,
                        default="undefined",
                        help="URL of the icon for the embedded app (default: undefined)")

parser.add_argument("-i",
                    dest="INTERACTIVE",
                    action="store_true",
                    help="Give the parameters interactively during runtime.")

args = parser.parse_args()


# if interactive mode is activated, ask the user for all unspecified arguments
input_invalid = ['""', "", "undefined"]
if args.INTERACTIVE:
    if not args.TITLE:
        args.TITLE = input("TITLE: ")
    if args.ROLES in input_invalid:
        role_input = input("ROLES: ")
        if role_input not in input_invalid:
            args.ROLES = input("ROLES: ").split(" ")
        else:
            args.ROLES = ['PUBLIC']
    if args.DESCRIPTION == "":
        args.DESCRIPTION = input("DESCRIPTION: ")
    # icon_class and icon_source_url are not both allowed
    if args.ICON_CLASS not in input_invalid and args.ICON_SOURCE_URL not in input_invalid:
        print("\nSpecify either ICON_CLASS or ICON_SOURCE_URL, not both of them.")
        exit()
    # if one of icon_class and icon_source_url is specified, we can continue
    if args.ICON_CLASS in input_invalid and args.ICON_SOURCE_URL in input_invalid:
        icon_input = input("ICON_CLASS: ")
        if icon_input not in input_invalid:
            args.ICON_CLASS = icon_input
            args.ICON_SOURCE_URL = "undefined"
        else:
            args.ICON_CLASS = "undefined"
            icon_input = input("ICON_SOURCE_URL: ")
            if icon_input not in input_invalid:
                args.ICON_SOURCE_URL = icon_input
            else:
                print("\nNo icon has been specified.")
                exit()
else:
    # due to the interactive parameter, we cant make the icon_group required
    # anymore, so we have to check it manually
    if args.ICON_CLASS in input_invalid and args.ICON_SOURCE_URL in input_invalid:
        print("\nSpecify either ICON_CLASS or ICON_SOURCE_URL, not both of them.")
        exit()

# add quotation marks to the icon parameters, if they are defined
if args.ICON_CLASS != "undefined":
    args.ICON_CLASS = f"'{args.ICON_CLASS}'"
if args.ICON_SOURCE_URL != "undefined":
    args.ICON_SOURCE_URL = f"'{args.ICON_SOURCE_URL}'"

root = path.dirname(path.abspath(__file__))

# definition of all needed paths
APP = path.join(root, "src", "app")
APP_MODULES = path.join(APP, "app.module.ts")
APP_ROUTING_MODULES = path.join(APP, "route", "app-routing.module.ts")
TEILER = path.join(APP, "teiler")
TEILER_MODULES = path.join(TEILER, "teiler.module.ts")
TEILER_APP = path.join(TEILER, "teiler-app.ts")
TEILER_SERVICE = path.join(TEILER, "teiler.service.ts")
SERVICE_FILE = path.join(APP, f"{args.NAME}.service.ts")
SERVICE_SPEC_FILE = path.join(APP, f"{args.NAME}.service.spec.ts")
COMPONENT_FILE = path.join(APP, args.NAME, f"{args.NAME}.component.ts")
ROUTE_MANAGER = path.join(APP, 'route', "route-manager.service.ts")

# different variations of the NAME, that will be used later
# component and service name will be extracted from the generated files
COMPONENT_NAME = ""
SERVICE_NAME = ""
NAME_ENUM = args.NAME.replace("-", "_").upper()

"""------------------------------
1. Generate service and component
------------------------------"""
print(f"\nGenerate new service {args.NAME}...")

rt = subprocess.call(['npm', 'run', 'ng', 'g', 's', args.NAME], cwd=root,
                     shell=True)
if rt:
    print("Generating failed...")
    exit()

print(f"\nGenerate new component {args.NAME}...")
rt = subprocess.call(['npm', 'run', 'ng', 'g', 'c', args.NAME], cwd=root,
                     shell=True)
if rt:
    print("Something went wrong")
    exit()

"""-------------------------------------
1.5. Remove Samply from XXX.component.ts
-------------------------------------"""
print(f"\nRemove Samply from {args.NAME}.component.ts")

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

dest_dir = path.join(APP, "embedded", args.NAME)
if path.isdir(dest_dir):
    shutil.rmtree(dest_dir)
shutil.move(path.join(APP, args.NAME), path.join(APP, "embedded"))

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
        if not found_section and line.find(args.NAME) != -1:
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
            lines[i - 1] = lines[i - 1].replace("\n", ",\n")
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

import_string = f'import {{{SERVICE_NAME}}} from "./{args.NAME}.service";\n'

with open(TEILER_MODULES, "r") as file:
    lines = file.readlines()
    last_import_line = 0
    found_section = False
    for i, line in enumerate(lines):
        if not found_section and line.find("import {") != -1:
            last_import_line = i
            continue
        if not found_section and line.find("providers:") != -1:
            found_section = True
        if found_section and line.find("]") != -1:
            lines[i] = line.replace("]", f",\n\t\t{SERVICE_NAME}]")
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
        if not found_section and line.find(
            "export enum EmbeddedTeilerApps") != -1:
            found_section = True
            continue
        if found_section and line.find("}") != -1:
            lines[i - 1] = lines[i - 1].replace("\n", ",\n")
            lines.insert(i, f"\t{NAME_ENUM} = '{args.NAME}'\n")
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
    f'''\tdescription: string = "{args.DESCRIPTION}";
\ticonClass: string | undefined = {args.ICON_CLASS};
\ticonSourceUrl: string | undefined = {args.ICON_SOURCE_URL};
\ttitle: string = "{args.TITLE}";
\troles: TeilerRole[] = [{",".join(["TeilerRole.TEILER_" + role for role in args.ROLES])}];

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

import_string = f'import {{{SERVICE_NAME}}} from "./{args.NAME}.service";\n'

with open(TEILER_SERVICE, "r") as file:
    lines = file.readlines()
    found_section1 = False
    edited_section1 = False
    found_section2 = False
    last_import_line = 0
    SERVICE_NAME_lower = SERVICE_NAME[0].lower() + SERVICE_NAME[1:]
    for i, line in enumerate(lines):
        if not found_section1 and line.find("import {") != -1:
            last_import_line = i
        if not found_section1 and line.find("constructor") != -1:
            found_section1 = True
            continue
        if found_section1 and line.find(")") != -1:
            lines[i - 1] = lines[i - 1].replace("\n", f",\n\t\t{SERVICE_NAME_lower}: {SERVICE_NAME}\n")
            edited_section1 = True
            continue
        if found_section1 and edited_section1 and line.find("let embeddedTeilerApps") != -1:
            found_section2 = True
        if found_section2 and line.find("]") != -1:
            lines[i] = line.replace("]", f",\n\t\t\t{SERVICE_NAME_lower}]")
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

import_string = f'import {{{COMPONENT_NAME}}} from "../embedded/{args.NAME}/{args.NAME}.component";\n'
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
            lines[i - 1] = lines[i - 1].replace("\n", ",\n")
            lines.insert(i, template)
            lines.insert(last_import_line + 1, import_string)
            break
    else:
        print("Could not find the needed lines.")
        exit()

with open(ROUTE_MANAGER, "w") as file:
    file.writelines(lines)

print("\nSuccess!")

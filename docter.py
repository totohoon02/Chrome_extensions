import argparse
import os

parser = argparse.ArgumentParser(description="swagger document generator")

# Args
parser.add_argument("-p", "--path", dest="path", required=True, help="Windows file path")
args = parser.parse_args()

# run
path = args.path
base_dir = "/".join(path.split("\\")[:-1])
doc_dir = base_dir + "/" + "docs"
filename = path.split("\\")[-1]

# make doc folder
if not os.path.isdir(doc_dir):
    os.mkdir(doc_dir)

# read file
statements = []
summarys = []

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

    for i in range(len(lines)):
        line = lines[i].strip() 
        if(line.startswith("public") and not line.startswith("public class")):
            strs = lines[i].strip()
            while True:
                i += 1
                if lines[i].strip().startswith("return"):
                    break
                strs += " " + lines[i].strip()
            strs = strs.replace("{", "")
            strs = strs.replace("public ", "")

            summarys.append(strs.split(" ")[1].split("(")[0])
            statements.append(strs.strip() + ";")

docfilename = filename.split(".")[0] + "Docs" + ".java"

# write file
with open(doc_dir + "/" + docfilename, "w", encoding="utf-8") as f:
    template = '@Tag(name = "' + filename.split(".")[0] + '", description = "")\n'
    template += 'public interface ' + docfilename.split(".")[0] + ' {\n'

    for i in range(len(statements)):
        template += f'\t@Operation(summary = "{summarys[i]}", description = "")\n'
        template += '\t' + statements[i] + '\n'
        template += '\n'
        
    template += '}'

    f.write(template)
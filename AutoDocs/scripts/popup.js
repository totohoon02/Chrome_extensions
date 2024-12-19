const input_file = document.querySelector("#javafile");
const test = document.querySelector("#test");
const btn_copy = document.querySelector("#btn_copy");
const btn_download = document.querySelector("#btn_download");

let template = "";
let className = "";

btn_copy.addEventListener("click", function(){
    navigator.clipboard.writeText(template);
    alert("카피!");
});

btn_download.addEventListener("click", function(){
    alert("다운로드!");
    const blob = new Blob([template], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); 
    link.download = `${className}Docs.java`;
    link.click();
});

input_file.addEventListener("change", function (ev) {
    const file = ev.target.files[0];

    if(!file) return;

    const reader = new FileReader();
        
    reader.onload = function (ev) {
        btn_copy.style.display = "block";
        btn_download.style.display = "block";
        if (ev.target.result) {
            let code = ev.target.result;
            let lines = code.split("\n");
            let rtn_text = [];
            let temp_text;
            
            // read file
            for(let i=0; i< lines.length; i++){
                let line = lines[i].trim()

                // class name
                if(line.startsWith("public class")){
                    className = line.replace("public class ", "").trim().split(" ")[0];
                }

                // method
                if(line.startsWith("public") && !line.startsWith("public class")){
                    temp_text = "\t" + line + "\n";
                    
                    // multiline parameter
                    while(true){
                        if(lines[i].endsWith("{")){
                            break;
                        }
                        i++;
                        temp_text += " " + lines[i].trim();
                    }
                    temp_text = temp_text.replace("public", "");
                    temp_text = temp_text.replace("{", "");
                    temp_text = temp_text.trim() + ";"
                    rtn_text.push(temp_text);
                    
                }
            }
            
            // write file
            template = `@Tag(name = "${className}", description = "")\n`;
            template += `public interface ${className}Docs {\n`;
            
            for(let i=0; i<rtn_text.length; i++){
                template += '\t' + `@Operation(summary = "", description = "")\n`;
                template += '\t' + rtn_text[i] + '\n';
                template += '\n';
            }
            
            template += '}';
        }
    }
    
    reader.readAsText(file);
});
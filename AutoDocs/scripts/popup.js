const input_file = document.querySelector("#javafile");
const input_text = document.querySelector("#javatext");
const result = document.querySelector("#result");
const btn_copy = document.querySelector("#btn_copy");
const btn_download = document.querySelector("#btn_download");
const select = document.querySelector("#doctype");

let template = "";
let className = "";
let suffix = "Docs";
let doctype = "swagger";
let rtn_text = [];


select.addEventListener('change', (event) => {
    const value = event.target.value;
    if(value == "swagger"){
        suffix = "Docs";
        doctype = "swagger";
    }
    else if(value == "service"){
        suffix = "";
        doctype = "service"
    }
    else if(value == "repository"){
        suffix = "";
        doctype = "service";
    }
});

btn_copy.addEventListener("click", function(){
    if(className == "" || template == "") return;
    alert("카피!");
    navigator.clipboard.writeText(template);
});

btn_download.addEventListener("click", function(){
    if(className == "" || template == "") return;
    alert("다운로드!");
    const blob = new Blob([template], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); 
    link.download = `${className}${suffix}.java`;
    link.click();
});

input_text.addEventListener("input", function(ev) {
    input_file.value = "";
    let code = ev.target.value;
    generate(code);
    result.value = template;
});

input_file.addEventListener("change", function (ev) {
    input_text.value = "";
    const file = ev.target.files[0];

    if(!file) return;

    const reader = new FileReader();
        
    reader.onload = function (ev) {
        if (ev.target.result) {
            let code = ev.target.result;
            generate(code);
            result.value = template;
        }
    }
    
    reader.readAsText(file);
});


function generate(code){
    let lines = code.split("\n");
    let temp_text = "";
    rtn_text = [];

    // read file
    for(let i=0; i< lines.length; i++){
        let line = lines[i].trim()
        
        if(!line.startsWith("public")){
            continue;
        }

        if(line.startsWith("public class")){
            line = line.replace("public class", "");
            line = line.replace(" {", "");
            className = line.trim()
            continue
        }

        while(true){
            temp_text += lines[i].trim();
            if(temp_text.endsWith("{")) break;
            i++;
        }
        temp_text = temp_text.replace(",", ", ");
        temp_text = temp_text.replace("public", "")
        temp_text = temp_text.replace("{", "");
        temp_text = temp_text.trim() + ";";

        rtn_text.push(temp_text);
        temp_text = "";
    }

    if(doctype == "swagger"){
        swagger_template();
    }
    else {
        interface_template();
    }
}

function swagger_template(){
    template = `@Tag(name = "${className}", description = "")\n`;
    template += `public interface ${className}${suffix} {\n`;
    
    for(let i=0; i<rtn_text.length; i++){
        template += '\t' + `@Operation(summary = "", description = "")\n`;
        template += '\t' + rtn_text[i] + '\n';
        template += '\n';
    }
    
    template += '}';
}

function interface_template(){
    template = `public interface ${className}${suffix} {\n`;
    for(let i=0; i<rtn_text.length; i++){
        template += '\t' + rtn_text[i] + '\n';
        template += '\n';
    }
    template += '}';
}

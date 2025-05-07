// ===== DOM 요소 =====
const inputFile = document.querySelector("#javafile");
const inputText = document.querySelector("#javatext");
const resultBox = document.querySelector("#result");
const btnCopy = document.querySelector("#btn_copy");
const btnDownload = document.querySelector("#btn_download");
const selectType = document.querySelector("#doctype");

// ===== 상태 =====
let template = "";
let className = "";
let suffix = "Docs";
let doctype = "swagger";
let rtnText = [];

// ===== 도큐먼트 타입 선택 =====
selectType.addEventListener("change", (e) => {
	doctype = e.target.value;
	suffix = ["swagger"].includes(doctype) ? "Docs" : "";
});

// ===== 복사 기능 =====
btnCopy.addEventListener("click", () => {
	if (!className || !template) return;
	navigator.clipboard.writeText(template);
	alert("Copied!");
});

// ===== 다운로드 기능 =====
btnDownload.addEventListener("click", () => {
	if (!className || !template) return;
	const blob = new Blob([template], { type: "text/plain" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${className}${suffix}.${
		doctype === "pyservice" ? "py" : "java"
	}`;
	link.click();
	alert("Download!");
});

// ===== 텍스트 입력 =====
inputText.addEventListener("input", (e) => {
	inputFile.value = "";
	const code = e.target.value;
	template =
		doctype === "pyservice" ? parsePythonInterface(code) : parseJavaClass(code);
	resultBox.value = template;
});

// ===== 파일 입력 =====
inputFile.addEventListener("change", (e) => {
	inputText.value = "";
	const file = e.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		const code = e.target.result;
		template =
			doctype === "pyservice"
				? parsePythonInterface(code)
				: parseJavaClass(code);
		resultBox.value = template;
	};
	reader.readAsText(file);
});

// ===== Java Class 인터페이스 or Swagger 생성 =====
function parseJavaClass(code) {
	const lines = code.split("\n");
	let temp = "";
	rtnText = [];
	className = "";

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trim();
		if (line.startsWith("public class")) {
			className = line
				.replace("public class", "")
				.replace("{", "")
				.trim()
				.replace(/Impl$/, ""); // ✅ Impl 제거
			continue;
		}
		if (!line.startsWith("public")) continue;

		while (!lines[i].trim().endsWith("{")) {
			temp += lines[i].trim() + " ";
			i++;
		}
		temp += lines[i].trim();
		temp =
			temp.replace("public", "").replace("{", "").replace(",", ", ").trim() +
			";";
		rtnText.push(temp);
		temp = "";
	}

	return doctype === "swagger"
		? buildSwaggerTemplate()
		: buildJavaInterfaceTemplate();
}

function buildSwaggerTemplate() {
	let result = `@Tag(name = "${className}", description = "")\n`;
	result += `public interface ${className}${suffix} {\n`;
	for (const line of rtnText) {
		result += `\t@Operation(summary = "", description = "")\n\t${line}\n\n`;
	}
	return result + "}";
}

function buildJavaInterfaceTemplate() {
	let result = `public interface ${className}${suffix} {\n`;
	for (const line of rtnText) {
		result += `\t${line}\n\n`;
	}
	return result + "}";
}

// ===== Python Abstract Interface 생성 =====
function parsePythonInterface(code) {
	const lines = code.split("\n");
	const result = ["from abc import ABC, abstractmethod", ""];
	const classRegex = /^\s*class\s+(\w+)\s*(\([^\)]*\))?:/;
	const defRegex = /^\s*def\s+(\w+)\s*\(([^)]*)\):/;
	const asyncDefRegex = /^\s*async\s+def\s+(\w+)\s*\(([^)]*)\):/;

	let insideClass = false;

	for (const line of lines) {
		const classMatch = classRegex.exec(line);
		const defMatch = defRegex.exec(line);
		const asyncMatch = asyncDefRegex.exec(line);

		if (classMatch) {
			className = classMatch[1].replace("Impl", "");
			insideClass = true;
			result.push(`class ${className}(ABC):`);
		} else if (insideClass && (defMatch || asyncMatch)) {
			const isAsync = !!asyncMatch;
			const name = isAsync ? asyncMatch[1] : defMatch[1];
			if (name === "__init__") continue;

			const args = isAsync ? asyncMatch[2] : defMatch[2];
			result.push(`\n\t@abstractmethod`);
			result.push(`\t${isAsync ? "async " : ""}def ${name}(${args}):`);
			result.push(`\t\tpass`);
		}
	}

	return result.join("\n");
}

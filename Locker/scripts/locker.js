async function getFilesStructure() {
    const owner = 'totohoon02';
    const repo = 'locker';
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    const files = data.tree.filter(item => item.type === 'blob').map(item => item.path);
    

    let fileStructure = {};

    for(const file of files){
        if(file == "README.md" || file == "help.txt"){
            continue;
        }
        const split = file.split('/');
        const category = split.length > 1 ? split[0] : 'config';
        const fileName = split.length > 1 ? split[1] : split[0];

        if (!fileStructure[category]) {
            fileStructure[category] = new Set();
        }
        
        fileStructure[category].add(fileName);
    }
    
    for(const key in fileStructure) {
        fileStructure[key] = Array.from(fileStructure[key]);
    }

    return fileStructure;
}


let fileStructure = {};

document.addEventListener('DOMContentLoaded', async () => {
    fileStructure = await getFilesStructure();

    const mainCategory = document.getElementById('mainCategory');
    const subCategory = document.getElementById('subCategory');
    const downloadBtn = document.getElementById('btn_download');

    // 메인 카테고리 변경 시 서브 카테고리 업데이트
    mainCategory.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        updateSubCategory(selectedCategory);
    });

    // 다운로드 버튼 클릭 이벤트
    downloadBtn.addEventListener('click', async () => {
        const category = mainCategory.value;
        const fileName = subCategory.value;

        if (!category || !fileName) {
            alert('Please select both category and file');
            return;
        }

        try {
            await downloadFile(category, fileName);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
        }
    });
});

function updateSubCategory(category) {
    const subCategory = document.getElementById('subCategory');
    subCategory.innerHTML = '<option value="">Select Sub-category</option>';

    if (category && fileStructure[category]) {
        fileStructure[category].forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            subCategory.appendChild(option);
        });
    }
}

async function downloadFile(category, fileName) {
    const owner = 'totohoon02';
    const repo = 'locker';
    let path = '';
    
    // path
    if(category == 'config'){
        path = `${fileName}`;
    }else if(category == 'docker'){
        path = `docker/${fileName}/docker-compose.yml`;
        fileName = 'docker-compose.yml';
    }else if(category == 'java'){
        path = `java/${fileName}`;
    }

    


    try {
        // GitHub API를 통해 파일 내용 가져오기
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch file');
        }

        const data = await response.json();
        
        // Base64로 인코딩된 내용을 디코드
        const content = atob(data.content);
        
        // 파일 다운로드 (UTF-8 인코딩 지정)
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
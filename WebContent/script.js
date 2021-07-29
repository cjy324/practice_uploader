/* 업로더 */
// 태그 가져오기
const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const uploadFiles = document.getElementsByName("uploadFiles");
const infoZone = document.getElementById("current_file_info");
const progressBarZone = document.getElementById("progressBarZone");
const allFilesProgressBar = document.getElementById("allFilesProgressBar");
const allProgressBar = document.getElementById("allProgressBar");
const progressBar = document.getElementById("progressBar");
const allFilesMessage = document.getElementById("allFilesMessage");
const allMessage = document.getElementById("allMessage");
const message = document.getElementById("message");
const uploadedZone = document.getElementById("uploadedZone");


// fileList를 담을 배열 객체 생성(전역변수)
let globalFileList = [];  // 임시 리스트(화면에 그리기 용)
let forUploadFileList = [];  // 실제 업로드될 리스트(실제 선택된 파일들을 담을)
const forUploadFileListIndex = 0;

// ajax 통신을 하기 위한 XmlHttpRequest 객체 생성
const xhttp = new XMLHttpRequest();
// ajax 통신이 중단됐는지 여부를 알 수 있는 indicator 변수 선언
let indicator = false; // 기본값 false

// 버튼으로 파일추가input 불러오기
function selectFiles() {
    fileInput.click();
}

// 업로드 될 파일리스트 그리기
function showFiles(files) {
    
    let fileListLi = "";	// dropZone에 drop한 파일별 태그 생성
    
    for(let i = 0; i < files.length; i++) {
        console.log(files[i]);
        fileListLi += "<li>";
        fileListLi += "<input id='chk_file_" + [i] + "' type='checkbox' value='false' name='uploadFiles' checked>";
        fileListLi += "<span>" + files[i].name + "</span>";
        fileListLi += "<span> " + files[i].size + " Byte</span>";
        fileListLi += "</li>";
    }
    
    uploadZone.innerHTML = fileListLi;

    let filesSize = 0;
    let fileListInfo = "";
        fileListInfo += "<span>";
        fileListInfo += files.length;
        fileListInfo += "</span>개 , ";
        fileListInfo += "<span>";
        for(let k = 0; k < files.length; k++){
            filesSize += files[k].size; 
        }
        fileListInfo += filesSize;
        fileListInfo += " byte </span>";
        fileListInfo += "<span>추가됨</span>";

    infoZone.innerHTML = fileListInfo;

    if(files.length == 0){
        let uploadZoneMessage = "";
        uploadZoneMessage += "<li style='height:100%; justify-content: center; align-items: center;'>";
        uploadZoneMessage += "<span style='font-weight: normal; color: blue; font-size: 12px;'>이곳에 파일을 Drag & Drop 하세요.</span>";
        uploadZoneMessage += "</li>";
        
        uploadZone.innerHTML = uploadZoneMessage; 
    }
    
}

// 파일 업로드를 위한 데이터 셋팅(from Input)
function setUploadFiles(e){
    // Input으로부터 파일 배열 가져오기
    globalFileList = e.target.files;
    // console.log(globalFileList);
    // input에 파일이 들어오면 dropZone에 업로드 될 파일리스트 그리기
    showFiles(globalFileList);
}

// 드래그한 파일이 최초로 uploadZone에 진입했을 때
uploadZone.addEventListener("dragenter", function(e) {
    e.stopPropagation();
    e.preventDefault();
})
// 드래그한 파일이 uploadZone을 벗어났을 때
uploadZone.addEventListener("dragleave", function(e) {
    e.stopPropagation();
    e.preventDefault();
})
// 드래그한 파일이 uploadZone에 머물러 있을 때
uploadZone.addEventListener("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();
})
// 드래그한 파일이 uploadZone에 드랍되었을 때
uploadZone.addEventListener("drop", function(e) {
    e.preventDefault();
    
    const droppedFiles = e.dataTransfer && e.dataTransfer.files;
    console.log("droppedFiles: " + droppedFiles);
    
    if (droppedFiles != null) {
        // 만약 files의 갯수가 1보다 작으면 "폴더 업로드 불가" 알림
        if (droppedFiles.length < 1) {
            alert("폴더 업로드 불가");
            return;
        }
        // uploadZone에 드랍된 파일들로 파일리스트 세팅
        globalFileList = droppedFiles;
        showFiles(droppedFiles);
    } else {
        alert("ERROR");
    }
})

// 전체 선택/해제
function setAllCheckbox(){
    if(uploadFiles.length > 0){
        const allCheckbox = document.getElementById("allCheckbox");
        if(allCheckbox.checked){
            for(let i = 0; i < uploadFiles.length; i++){
                uploadFiles[i].checked = true;
            }
        }else{
            for(let i = 0; i < uploadFiles.length; i++){
                uploadFiles[i].checked = false;
            }
        }
    }  
}

// 선택된 파일 삭제
function removeSelectedFiles(){

    if(confirm("정말 삭제하시겠습니까?") == false){
        return;
    }

    // 선택 파일만 담기
    let removeTargetIndex = -1;
    let tempArray = [];  

    // FileList 객체는 Array 객체가 아니므로 splice()함수를 쓸 수 없음
    // 따라서 splice()를 사용하기 위해 임시로 FileList를 Array로 담아서 진행
    for(let x = 0; x < globalFileList.length; x++){
        tempArray.push(globalFileList[x]);
    }

    // 배열 내 체크된 파일요소 내용 삭제
    for(let i = 0; i < uploadFiles.length; i++){
        if(uploadFiles[i].checked){  // 체크된 파일만 필터링
            removeTargetIndex = Number(uploadFiles[i].id.split("_")[2]);
            // 체크된 파일 index와 newFileList의 index가 일치하면 
            for(let k = 0; k < tempArray.length; k++){
                if(removeTargetIndex == k){
                    delete tempArray[k] // newFileList의 index가 removeTargetIndex인 요소 삭제
                    console.log(k + " file delete")
                }
            }
        }
    }

    // 배열 내 비어있는 요소 삭제
    for(let y = 0; y < tempArray.length; y++){
        if(tempArray[y] === undefined){
            tempArray.splice(y, 1);
            y--;
        }
    }

    // 다시 원래대로 담기
    globalFileList = tempArray;
    
    if(removeTargetIndex == -1){
        alert("선택된 파일이 없습니다.");
        return;
    }
    
    showFiles(globalFileList);
}

// 전체 파일 선택하기
function selectAllFilesAndRemove(){
    for(let i = 0; i < uploadFiles.length; i++){
        uploadFiles[i].checked = true;
    }
    removeSelectedFiles();
}

// 선택된 업로드 파일 담기
function setUploadFileList(){
    // // 21.07.29 삭제
    // // 선택 파일만 담기
    // let uploadTargetIndex = -1;
    
    // for(let i = 0; i < uploadFiles.length; i++){
    //     if(uploadFiles[i].checked){  // 체크된 파일만 필터링
    //         uploadTargetIndex = Number(uploadFiles[i].id.split("_")[2]);
    //         // 체크된 파일 index와 downloadFilelist의 파일 index가 일치하면 다운로드용 리스트에 새로 담기
    //         for(let k = 0; k < globalFileList.length; k++){
    //             if(uploadTargetIndex == k){
    //                 forUploadFileList.push(globalFileList[k]);
    //             }
    //         }
    //     }
    // }

    forUploadFileList = globalFileList;

    if(forUploadFileList.length == 0){
        alert("선택된 파일이 없습니다.")
        return;
    }else{
        startUpload(forUploadFileListIndex);
    }
}

// 업로드 후 파일리스트 리셋
function drawUploadedFileList(uploadedFileList){
    // // 21.07.29 임시 삭제
    // 업로드된 파일리스트 그리기
    // let uploadedFileListLi = "";	// uploadedZone에 upload한 파일별 태그 생성
    
    // for(let i = 0; i < uploadedFileList.length; i++) {
    //     uploadedFileListLi += "<li>";
    //     uploadedFileListLi += "<input id='chk_file_" + [i] + "' type='checkbox' value='false' checked>";
    //     uploadedFileListLi += "<span>" + uploadedFileList[i].name + "</span>";
    //     uploadedFileListLi += "<span> " + uploadedFileList[i].size + " Byte</span>";
    //     uploadedFileListLi += "</li>";
    // }

    // uploadedZone.innerHTML = uploadedFileListLi;

    // 업로드 대기 파일리스트 초기화
    let uploadZoneMessage = "";
        uploadZoneMessage += "<li style='height:100%; justify-content: center; align-items: center;'>";
        uploadZoneMessage += "<span style='font-weight: normal; color: blue; font-size: 12px;'>이곳에 파일을 Drag & Drop 하세요.</span>";
        uploadZoneMessage += "</li>";
    
    uploadZone.innerHTML = uploadZoneMessage; 

    let resetFileListInfo = "";
        resetFileListInfo += "<span>0</span>개 , ";
        resetFileListInfo += "<span>0 byte </span>";
        resetFileListInfo += "<span>추가됨</span>";

    infoZone.innerHTML = resetFileListInfo;
}

// GUID 생성 함수
function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
}

// ajax통신
function startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, forUploadFileList, forUploadFileListIndex){

    // console.log("indicator22222: " + indicator);
    console.log(forUploadFileList[forUploadFileListIndex].name + " file" + "[" + Number(slicedFileIndex+1) + "]" + "업로드 시작");
    
    /* progressBar 시작 */
    xhttp.upload.onloadstart = function (e) {
        progressBar.value = 0;
        progressBar.max = e.total;
        allProgressBar.value = 0;
        allProgressBar.max = e.total;
        allMessage.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "\"" + " file uploading...";
    };
    // 단일 전송인 경우
    if(slicedFiles.length == 0){
        xhttp.upload.onprogress = function (e) {
            allFilesProgressBar.value = (forUploadFileListIndex+1)/(forUploadFileList.length)*100;
            allFilesProgressBar.max = 100;
            allProgressBar.value = e.loaded;
            allProgressBar.max = e.total;
            progressBar.value = e.loaded;
            progressBar.max = e.total;
        };
        xhttp.upload.onloadend = function (e) {
            allMessage.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "\"" + " file upload complete!!";
            message.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "\"" + " file upload complete!!";
            if(e.loaded == e.total && forUploadFileListIndex+1 == forUploadFileList.length){
                allFilesMessage.textContent = "ALL Files Upload Complete!!!";
                allMessage.textContent = "";
                message.textContent = "";
            }
        };
    // 분할 전송인 경우
    }else{
        xhttp.upload.onprogress = function (e) {
            allFilesProgressBar.value = (forUploadFileListIndex+1)/(forUploadFileList.length)*100;
            allFilesProgressBar.max = 100;
            allProgressBar.value = (slicedFileIndex+1)/(slicedFiles.length)*100;
            allProgressBar.max = 100;
            progressBar.value = e.loaded;
            progressBar.max = e.total;
        };
        xhttp.upload.onloadend = function (e) {
            allMessage.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "\"" + " file uploading...";
            if(slicedFileIndex+1 == slicedFiles.length){
                allMessage.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "\"" + " file upload complete!!";
            }
            message.textContent = "\"" + forUploadFileList[forUploadFileListIndex].name + "[" + Number(slicedFileIndex+1) + "]" + "\"" + " file upload complete!!";
            if(e.loaded == e.total && forUploadFileListIndex+1 == forUploadFileList.length){
                allFilesMessage.textContent = "ALL Files Upload complete!!";
                allMessage.textContent = "";
                message.textContent = "";
            }
        }
    }
    /* progressBar 끝 */

    /* 파일 전송을 위한 ajax통신 시작 */
    // file 전송 정보를 담을 formData 객체 생성
    const newFormData = new FormData();
    // 각 file을 formData 객체에 담기
    if(slicedFiles.length == 0){ // 단일 전송인 경우
        newFormData.append("files", forUploadFileList[forUploadFileListIndex]);
    }else{  // 분할 전송인 경우
        newFormData.append("slicedFiles", slicedFiles[slicedFileIndex]);
    }

    // http 요청 타입 / 주소 / 동기식 여부 설정
    if(slicedFiles.length == 0){    // 단일 전송인 경우
        xhttp.open("POST", "http://localhost:8086/upload/usr/upload/server?index=" + 0 + params, true); // 메서드와 주소 설정    
    }else{      // 분할 전송인 경우
        xhttp.open("POST", "http://localhost:8086/upload/usr/upload/server?index=" + slicedFileIndex + params, true); // 메서드와 주소 설정
    }
    
    // http 요청
    xhttp.send(newFormData);   // 요청 전송(formData 전송)

    // XmlHttpRequest의 요청
    // 통신 상태 모니터링
    xhttp.onreadystatechange = function(e){   // 요청에 대한 콜백
        // XMLHttpRequest를 이벤트 파라미터에서 취득
        const req = e.target;
        // console.log(req);   // 콘솔 출력

        // 통신 상태가 완료가 되면...
        if(req.readyState === 4) {    // 요청이 완료되면
            // Http response 응답코드가 200(정상)
            // states = 0 unintialized 요청이 초기화 안 된 상태, open() not called yet.
            // 1=loaded 서버 연결 설정된(열린) 상태, open() has been called.
            // 2=loading 요청 접수된 상태, send() has been called
            // 3=interactive 요청 처리 중 상태
            // 4=complete 요청 완료되고 응답 준비된 상태
            if(req.status === 200 && indicator == true) {
                // console.log("indicator33333333: " + indicator);
                
                if(slicedFileIndex < slicedFiles.length-1){ // 만약, index가 slicedFiles.length 보다 작으면
                    slicedFileIndex++; // index 1 증가
                    // 재귀함수: 함수 내에서 자신을 다시 호출
                    startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, forUploadFileList, forUploadFileListIndex);
                }
                else if(forUploadFileListIndex < forUploadFileList.length-1){
                    forUploadFileListIndex++;
                    console.log(forUploadFileList[forUploadFileListIndex].name + " file 업로드 시작");  
                    startUpload(forUploadFileListIndex);
                }else{
                    console.log(forUploadFileList[forUploadFileListIndex].name + " file" + "업로드 - 종료")
                    // 21.07.29 임시 삭제
                    drawUploadedFileList(forUploadFileList);
                }              
                // console.log(xhttp.responseText)
            }else if(req.status === 200 && indicator == false && slicedFileIndex < slicedFiles.length-1){
                // console.log("indicator444444: " + indicator);
                console.log("---업로드 중단---");
                console.log("----LocalStorage에 현재 파일 정보 저장 시작----");
                // 업로드시 여러 파일이 중단될 수도 있으니 
                // 여러 파일이 중단될 경우를 고려해서
                // loacalStorage에 담을때 구분자, 배열 등을 활용해 잘 저장해 놓는 것이 중요
                // 나중에 이어올리기시 localStorage에 있는 해당 키들을 for문으로 돌리면서 일치하는 값 찾을 수 있도록 하기 위함..
                localStorage.setItem("resume_upload_" + guid, guid + "__" + slicedFileIndex + "__" + forUploadFileList[forUploadFileListIndex].name + "__" + forUploadFileList[forUploadFileListIndex].size);
                console.log("resume_upload_" + guid + " : " + guid + "__" + slicedFileIndex + "__" + forUploadFileList[forUploadFileListIndex].name + "__" + forUploadFileList[forUploadFileListIndex].size);
                console.log("----LocalStorage에 현재 파일 정보 저장 완료----");
                // console.log(xhttp.responseText)
            }else if(req.status === 200 && indicator == false && slicedFileIndex == slicedFiles.length-1){
                alert("이미 \"" + forUploadFileList[forUploadFileListIndex].name + "\" file의 업로드가 완료되었습니다.");  
            }else{
                console.error("------통신 실패------");
                console.error("req.status: " + req.status);
                console.error(xhttp.responseText);
            }
        }
    }
    /* 파일 전송을 위한 ajax통신 끝 */
}

// 파일 업로드
function startUpload(forUploadFileListIndex){

    indicator = true;
    // console.log("indicator1111: " + indicator);
    console.log("startUpload--------------- forUploadFileListIndex: " + forUploadFileListIndex + " ---------------");  

    // 단일 파일 제한 용량 설정
    // 참고: Tomcat은 기본적으로 Post로 전송할 데이터의 크기를 최대2MB까지 Default로 잡고있다.(https://youngram2.tistory.com/110)
    const limitSize = 1 * 1024 * 1024;  // Byte // 약 2MB
    // console.log("limitSize: " + limitSize);
    
    // 분할한 파일을 담을 배열 객체
    const slicedFiles = [];
    // 분할 전송시 사용할 index
    let slicedFileIndex = 0;

    /* 분할 시작 */
    // 만약, 파일용량이 제한용량보다 크면
    if(forUploadFileList[forUploadFileListIndex].size >= limitSize){ 
        // 용량에 따른 분할 수 계산
        const slicedFilesNum = Math.ceil(forUploadFileList[forUploadFileListIndex].size / limitSize); 
        console.log("slicedFilesNum: " + slicedFilesNum);
        // 파일 분할
        for(let f = 0; f < slicedFilesNum; f++){
            // 각 분할 횟수별 분할 시작 포인트 설정
            const startPoint = limitSize * f;
            // slice(시작점, 자를점, Type)로 파일 분할
            const slicedFile = globalFileList[forUploadFileListIndex].slice(startPoint, startPoint + limitSize, forUploadFileList[forUploadFileListIndex].type);
            // 분할된 파일 slicedFiles 배열 객체에 담기
            slicedFiles.push(slicedFile);
        }
        console.log("slicedFiles : " + slicedFiles);
        console.log("slicedFiles.length : " + slicedFiles.length);
        
    }
    /* 분할 끝 */

    // 기본 파라미터 정보 담기
    let params = "&limitSize=" + limitSize;
        params += "&originName=" + forUploadFileList[forUploadFileListIndex].name;
        params += "&originSize=" + forUploadFileList[forUploadFileListIndex].size;
        params += "&originType=" + forUploadFileList[forUploadFileListIndex].type;

    /* 단일 파일일 경우 단일 전송 시작 */
    if(slicedFiles.length == 0){
        console.log("------단일 파일 전송 시작------");

        // params 추가 정보 담기
        params += "&sliced=false";
        params += "&guid=" + "0";
        params += "&slicedFilesLength=" + 0;
        
        // ajax통신 시작
        startAjax(xhttp, slicedFiles, slicedFileIndex, "0", params, forUploadFileList, forUploadFileListIndex);

    /* 단일 파일 전송 끝 */
    }
    
    /* 분할 파일일 경우 분할 전송 시작 */
    if(slicedFiles.length > 0){
        console.log("------분할 파일 전송 시작------");

        let guid = createGuid();
    
        /* 로컬스토리지에 저장된 기존 업로드 중단된 파일 정보들 확인 시작 */
        // Key: "resume_upload_" + guid
        // Vlaue: guid + "__" + slicedFileIndex + "__" + globalFileList[forUploadFileListIndex].name + "__" + globalFileList[forUploadFileListIndex].size
        // 구분자: __
        let canceledFileName;
        let canceledFileSize;
        if(localStorage.length > 0){
            // console.log("localStorage.length : " + localStorage.length);
            for(let l = 0; l < localStorage.length; l++){
                // 로컬스토리지로부터 정보 가져와 구분자를 기준으로 문자열 자르기
                // console.log("localStorage.getItem(localStorage.key(l)) : " + localStorage.getItem(localStorage.key(l)));
                canceledFileName = localStorage.getItem(localStorage.key(l)).split("__")[2];
                canceledFileSize = localStorage.getItem(localStorage.key(l)).split("__")[3];

                // 파일명과 파일크기로 파일 정보 대조
                if(forUploadFileList[forUploadFileListIndex].name == canceledFileName && forUploadFileList[forUploadFileListIndex].size == canceledFileSize){
                    // 이어올리기 선택
                    if(confirm("기존에 업로드된 데이터가 있습니다. 이어서 업로드하시겠습니까?")){
                        // 저장되있던 정보로 현재 파일의 정보 업데이트
                        guid = localStorage.getItem(localStorage.key(l)).split("__")[0];
                        slicedFileIndex = Number(localStorage.getItem(localStorage.key(l)).split("__")[1]);
                        // 해당 파일에 대한 로컬스토리지 정보 삭제
                        localStorage.removeItem(localStorage.key(l));
                    }else{
                        localStorage.removeItem(localStorage.key(l));
                    }
                }
            }
        }
        /* 로컬스토리지에 저장된 기존 업로드 중단된 파일 정보들 확인 끝 */

        // params 추가 정보 담기
        params += "&sliced=true";
        params += "&guid=" + guid;
        params += "&slicedFilesLength=" + slicedFiles.length;

        // ajax통신 시작
        startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, forUploadFileList, forUploadFileListIndex);
    
    /* 분할 파일 전송 끝 */
    }
}

// 업로드 중단 버튼
function cancelUpload(){
    // xhttp.abort(); // 통신 강제 중단
    // 만약, abort()를 통해 통신을 강제 중단시켜버리면 업로드 상태가 어떨지 알 수 없기 때문에 위험하다.
    // 따라서,
    // 통신 indicator를 false로 변경해서 다음 로직을 타지 않게끔해서 비교적 안전하게 업로드를 중단해준다.
    indicator = false;
    console.log("-------------upload canceled-------------");
}




/* -------------------------------------------------------------------------------------------------------------- */
/* 다운로더 */

// 태그 가져오기
const downlaodFrame = document.getElementById("download_frame");
const downloadZone = document.getElementById("downloadZone");
const downFiles = document.getElementsByName("downFiles");
const progressBarZone_down = document.getElementById("progressBarZone_down");
const allFilesProgressBar_down = document.getElementById("allFilesProgressBar_down");
const progressBar_down = document.getElementById("progressBar_down");
const allFilesMessage_down = document.getElementById("allFilesMessage_down");
const message_down = document.getElementById("message_down");


// let globalFileList = []; // 다운로드 파일 정보를 담아놓을 전역변수(삭제)
let forDownloadFilelistIndex = 0;

// downloadZone에 그리기
function drawDownloadFileList(globalFileList){
    let forDownloadFileListLi = "";	// uploadedZone에 upload한 파일별 태그 생성
    
    for(let i = 0; i < globalFileList.length; i++) {
        forDownloadFileListLi += "<li>";
        forDownloadFileListLi += "<input id='chk_file_" + [i] + "' type='checkbox' name='downFiles' value='false' checked>";
        forDownloadFileListLi += "<span>" + globalFileList[i].name + "</span>";
        forDownloadFileListLi += "<span> " + globalFileList[i].size + " Byte</span>";
        forDownloadFileListLi += "</li>";
    }

    downloadZone.innerHTML = forDownloadFileListLi;
}

// DB로 요청 후에 이미 파일 정보를 가져왔다고 가정..
// 파일 정보 가져와 다운로드 대상리스트 태그 그리기
// 파일 정보를 가져와서 전역변수에 담아놓기
function fileLoad(){
    // DB로부터 아래 형식으로 파일 정보를 받아왔다고 가정
    const file1 = {
        lastModified: 1580961046732,
        lastModifiedDate: 'Thu Feb 06 2020 12:50:46 GMT+0900 (대한민국 표준시) {}',
        name: "test1.zip",
        size: 3432864,
        path: "D:\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\Uploader\\upload\\test1.zip",
        type: "application/zip"
    };

    var file = new File(['test1'],
                     'test1.zip', 
                     {type:'application/zip'});
    const file2 = {
        lastModified: 1580961046732,
        lastModifiedDate: 'Thu Feb 06 2020 12:50:46 GMT+0900 (대한민국 표준시) {}',
        name: "테스트이미지.jpg",
        size: 14856,
        path: "D:\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\Uploader\\upload\\테스트이미지.jpg",
        type: "image/jpeg"
    };
    const file3 = {
        lastModified: 1580961046732,
        lastModifiedDate: 'Thu Feb 06 2020 12:50:46 GMT+0900 (대한민국 표준시) {}',
        name: "테스트영상.mp4",
        size: 73061740,
        path: "D:\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\Uploader\\upload\\테스트영상.mp4",
        type: "video/mp4"
    };


    // 전역변수 배열에 담기
    globalFileList.push(file);
    globalFileList.push(file);
    globalFileList.push(file);

    // forDownloadFilelist에 담긴 파일 정보로 태그 그리기
    drawDownloadFileList(globalFileList);
    showFiles(globalFileList);
}

// 다운로드 진행률
let progressPercentage = 0;

// 다운로드 프로그래스바 그리기
function drawDownloadProgressBar(progressPercentage, forDownloadFilelist, forDownloadFilelistIndex){
    
    progressBar_down.value = progressPercentage;
    progressBar_down.max = 100;
    message_down.textContent = "\"" + forDownloadFilelist[forDownloadFilelistIndex].name + "\"" + " file downloading...";
    allFilesProgressBar_down.value = (forDownloadFilelistIndex+1)/(forDownloadFilelist.length)*100;
    allFilesProgressBar_down.max = 100;

    if(progressPercentage == 100 && forDownloadFilelistIndex+1 == forDownloadFilelist.length){
        allFilesMessage_down.textContent = "ALL Files Download complete!!";
        message_down.textContent = "";
    }
}

// 현재 다운로드 진행률 모니터링
function checkDownProgress(downFileGuid, forDownloadFilelist, forDownloadFilelistIndex){
    
    const xhttp2 = xhttp;

    /* ajax통신 시작 */
    // http 요청 타입 / 주소 / 동기식 여부 설정
    xhttp2.open("POST", "http://localhost:8086/upload/usr/download/progress?guid=" + downFileGuid, true); // 메서드와 주소 설정    
    // http 요청
    xhttp2.send();   // 요청 전송

    // XmlHttpRequest의 요청 // 통신 상태 모니터링
    xhttp2.onreadystatechange = function(e){   // 요청에 대한 콜백
        const req2 = e.target;
        // console.log(req2);   // 콘솔 출력

        if(req2.readyState === 4) {
            if(req2.status === 200) {
                console.log("------통신 성공------");
                console.log("doneByte : " + xhttp2.responseText);
                progressPercentage = Number(xhttp2.responseText);
                drawDownloadProgressBar(progressPercentage, forDownloadFilelist, forDownloadFilelistIndex);
            }else{
                console.error("------통신 실패------");
                console.error("req2.status: " + req2.status);
                console.error(xhttp2.responseText);
            }
        }
    }
    /* ajax통신 끝 */
    
}

// iframe으로 다운로드 요청 보내기
function startIframRequest(forDownloadFilelist, forDownloadFilelistIndex){
    // 선택된 파일들에 대한 정보 URL로 담기
    // iframe에 URL 세팅
    let forDownloadUrl = "http://localhost:8086/upload/usr/download/server?";
    let downFileGuid = createGuid();

    forDownloadUrl += "index=" + forDownloadFilelistIndex;
    forDownloadUrl += "&guid=" + downFileGuid;
    forDownloadUrl += "&originName=" + forDownloadFilelist[forDownloadFilelistIndex].name;
    forDownloadUrl += "&originSize=" + forDownloadFilelist[forDownloadFilelistIndex].size;
    forDownloadUrl += "&originPath=" + forDownloadFilelist[forDownloadFilelistIndex].path;
    forDownloadUrl += "&originType=" + forDownloadFilelist[forDownloadFilelistIndex].type;

    downlaodFrame.src = encodeURI(forDownloadUrl); // encodeURI 참고 : https://jamesdreaming.tistory.com/2

    // setInterval(타겟함수,설정시간) 함수는 주기적으로 인자를 실행하는 함수
    // 일정한 시간 간격으로 작업을 수행하기 위해서 사용
    // clearInterval 함수를 사용하여 중지
    // 지정된 작업은 모두 실행되고 다음 작업 스케쥴이 중지
    const startInterval = setInterval(function(){
        if(progressPercentage < 100){  // 다운로드 진행률 값이 100보다 작으면..
            checkDownProgress(downFileGuid, forDownloadFilelist, forDownloadFilelistIndex);
        }else if(progressPercentage == 100){  // 다운로드 진행률 값이 100이면...종료
            clearInterval(startInterval);
            if(forDownloadFilelistIndex < forDownloadFilelist.length-1){ // 아직 다운로드해야 할 파일이 남았는지 체크
                progressPercentage = 0;
                forDownloadFilelistIndex++;
                startIframRequest(forDownloadFilelist, forDownloadFilelistIndex); // 다음 파일 다운로드 시작
            }
        }
    }, 100);  // ex) 1초 = 1000

}

// 다운로드 시작
function startDownload(forDownloadFilelistIndex){

    let downloadTargetIndex = -1;
    let forDownloadFilelist = [];

    for(let i = 0; i < downFiles.length; i++){
        if(downFiles[i].checked){  // 체크된 파일만 필터링
            downloadTargetIndex = Number(downFiles[i].id.split("_")[2]);
            // 체크된 파일 index와 downloadFilelist의 파일 index가 일치하면 다운로드용 리스트에 새로 담기
            for(let k = 0; k < globalFileList.length; k++){
                if(downloadTargetIndex == k){
                    forDownloadFilelist.push(globalFileList[k]);
                }
            }
        }
    }
    if(forDownloadFilelist.length == 0){
        alert("선택된 파일이 없습니다.")
        return;
    }else{
        startIframRequest(forDownloadFilelist, forDownloadFilelistIndex);
    }
}

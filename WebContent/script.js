
	//iframe window 가져오기
	//const uploadWindow = document.getElementById("upload_frame").contentWindow;
	
	//태그 가져오기
	const fileInput = document.getElementById("fileInput");
	const uploadZone = document.getElementById("uploadZone");
    const infoZone = document.getElementById("current_file_info");
    const progressBarZone = document.getElementById("progressBarZone");
	const progressBar = document.getElementById("progressBar");
    const allProgressBar = document.getElementById("allProgressBar");
	const message = document.getElementById("message");
    const allMessage = document.getElementById("allMessage");
	
	//fileList를 담을 배열 객체 생성(전역변수)
	let newFileList = [];
    const newFileListIndex = 0;

    // ajax 통신을 하기 위한 XmlHttpRequest 객체 생성
	const xhttp = new XMLHttpRequest();
    // ajax 통신이 중단됐는지 여부를 알 수 있는 indicator 변수 선언
    let indicator = false; // 기본값 false
	
	//버튼으로 파일추가input 불러오기
	function selectFiles() {
		fileInput.click();
	}
	
	//업로드 될 파일리스트 그리기
	function showFiles(files) {
		
		let fileListLi = "";	// dropZone에 drop한 파일별 태그 생성
        
	 	for(let i = 0; i < files.length; i++) {
		 	fileListLi += "<li>";
		 	fileListLi += "<input id='chk_file_" + [i] + "' type='checkbox' value='false'>";
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
	}
	
	//파일 업로드를 위한 데이터 셋팅(from Input)
	function setUploadFiles(e){
		// Input으로부터 파일 배열 가져오기
		newFileList = e.target.files;
		console.log(newFileList);
		// input에 파일이 들어오면 dropZone에 업로드 될 파일리스트 그리기
		showFiles(newFileList);
	}
	
	//드래그한 파일이 최초로 uploadZone에 진입했을 때
	uploadZone.addEventListener("dragenter", function(e) {
		e.stopPropagation()
		e.preventDefault()	
	})
	//드래그한 파일이 uploadZone을 벗어났을 때
	uploadZone.addEventListener("dragleave", function(e) {
		e.stopPropagation()
		e.preventDefault()
	})
	//드래그한 파일이 uploadZone에 머물러 있을 때
	uploadZone.addEventListener("dragover", function(e) {
		e.stopPropagation()
		e.preventDefault()
	})
	//드래그한 파일이 uploadZone에 드랍되었을 때
	uploadZone.addEventListener("drop", function(e) {
		e.preventDefault()
		
		const droppedFiles = e.dataTransfer && e.dataTransfer.files
		console.log(droppedFiles)
		
		if (droppedFiles != null) {
			// 만약 files의 갯수가 1보다 작으면 "폴더 업로드 불가" 알림
			if (droppedFiles.length < 1) {
				alert("폴더 업로드 불가")
				return
			}
			// uploadZone에 드랍된 파일들로 파일리스트 세팅
			newFileList = droppedFiles;
			showFiles(droppedFiles);
		} else {
			alert("ERROR")
		}
	})

    // ajax통신
    function startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, newFileList, newFileListIndex){

        console.log("indicator22222: " + indicator);
        console.log(newFileList[newFileListIndex].name + " file" + "[" + Number(slicedFileIndex+1) + "]" + "업로드 시작");
        
        /* progressBar 시작 */
        xhttp.upload.onloadstart = function (e) {
            progressBar.value = 0;
            progressBar.max = e.total;
            allMessage.textContent = "\"" + newFileList[newFileListIndex].name + "\"" + " file uploading...";
        };
        // 단일 전송인 경우
        if(slicedFiles.length == 0){
            xhttp.upload.onprogress = function (e) {
                progressBar.value = e.loaded;
                progressBar.max = e.total;
                allProgressBar.value = e.loaded;
                allProgressBar.max = e.total;
            };
            xhttp.upload.onloadend = function (e) {
                message.textContent = "\"" + newFileList[newFileListIndex].name + "\"" + " file upload complete!!";
                allMessage.textContent = "\"" + newFileList[newFileListIndex].name + "\"" + " file upload complete!!";
            };
        // 분할 전송인 경우
        }else{
            xhttp.upload.onprogress = function (e) {
                progressBar.value = e.loaded;
                progressBar.max = e.total;
                allProgressBar.value = (slicedFileIndex+1)/(slicedFiles.length)*100;
                allProgressBar.max = 100;
            };
            xhttp.upload.onloadend = function (e) {
                message.textContent = "\"" + newFileList[newFileListIndex].name + "[" + Number(slicedFileIndex+1) + "]" + "\"" + " file upload complete!!";
                allMessage.textContent = "\"" + newFileList[newFileListIndex].name + "\"" + " file uploading...";
                if(slicedFileIndex+1 == slicedFiles.length){
                    allMessage.textContent = "\"" + newFileList[newFileListIndex].name + "\"" + " file upload complete!!";
                }
            }
        }
        /* progressBar 끝 */

        /* 파일 전송을 위한 ajax통신 시작 */
        //file 전송 정보를 담을 formData 객체 생성
        const newFormData = new FormData();
        // 각 file을 formData 객체에 담기
        if(slicedFiles.length == 0){ // 단일 전송인 경우
            newFormData.append("files", newFileList[newFileListIndex]);
        }else{  // 분할 전송인 경우
            newFormData.append("slicedFiles", slicedFiles[slicedFileIndex]);
        }

        // http 요청 타입 / 주소 / 동기식 여부 설정
        if(slicedFiles.length == 0){    // 단일 전송인 경우
            xhttp.open("POST", "http://localhost:8086/upload/usr/server?index=" + 0 + params, true); // 메서드와 주소 설정    
        }else{      // 분할 전송인 경우
            xhttp.open("POST", "http://localhost:8086/upload/usr/server?index=" + slicedFileIndex + params, true); // 메서드와 주소 설정
        }
        
        // http 요청
        xhttp.send(newFormData);   // 요청 전송(formData 전송)

        // XmlHttpRequest의 요청
        // 통신 상태 모니터링
        xhttp.onreadystatechange = function(e){   // 요청에 대한 콜백
            // XMLHttpRequest를 이벤트 파라미터에서 취득
            const req = e.target;
            console.log(req);   // 콘솔 출력

            // 통신 상태가 완료가 되면...
            if(req.readyState === 4) {    // 요청이 완료되면
                // Http response 응답코드가 200(정상)
                // states = 0 unintialized 요청이 초기화 안 된 상태, open() not called yet.
                // 1=loaded 서버 연결 설정된(열린) 상태, open() has been called.
                // 2=loading 요청 접수된 상태, send() has been called
                // 3=interactive 요청 처리 중 상태
                // 4=complete 요청 완료되고 응답 준비된 상태
                if(req.status === 200 && indicator == true) {
                    console.log("indicator33333333: " + indicator);
                    
                    if(slicedFileIndex < slicedFiles.length-1){ // 만약, index가 slicedFiles.length 보다 작으면
                        slicedFileIndex++; // index 1 증가
                        // 재귀함수: 함수 내에서 자신을 다시 호출
                        startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, newFileList, newFileListIndex);
                    }
                    else if(newFileListIndex < newFileList.length-1){
                        newFileListIndex++;
                        console.log(newFileList[newFileListIndex].name + " file 업로드 시작");  
                        startUpload(newFileListIndex);
                    }else{
                        console.log(newFileList[newFileListIndex].name + " file" + "업로드 - 종료")
                    }              
                    //console.log(xhttp.responseText)
                }else if(req.status === 200 && indicator == false && slicedFileIndex < slicedFiles.length-1){
                    console.log("indicator444444: " + indicator);
                    console.log("---업로드 중단---")
                    console.log("----LocalStorage에 현재 파일 정보 저장 시작----")
                    // 업로드시 여러 파일이 중단될 수도 있으니 
                    // 여러 파일이 중단될 경우를 고려해서
                    // loacalStorage에 담을때 구분자, 배열 등을 활용해 잘 저장해 놓는 것이 중요
                    // 나중에 이어올리기시 localStorage에 있는 해당 키들을 for문으로 돌리면서 일치하는 값 찾을 수 있도록 하기 위함..
                    localStorage.setItem("resume_upload_" + guid, guid + "__" + slicedFileIndex + "__" + newFileList[newFileListIndex].name + "__" + newFileList[newFileListIndex].size);
                    console.log("resume_upload_" + guid + " : " + guid + "__" + slicedFileIndex + "__" + newFileList[newFileListIndex].name + "__" + newFileList[newFileListIndex].size);
                    console.log("----LocalStorage에 현재 파일 정보 저장 완료----")
                    //console.log(xhttp.responseText)
                }else if(req.status === 200 && indicator == false && slicedFileIndex == slicedFiles.length-1){
                    console.log("이미 \"" + newFileList[newFileListIndex].name + "\" file의 업로드가 완료되었습니다.");  
                }else{
                    console.log("통신 실패")
                    console.error("req.status: " + req.status)
                    console.error(xhttp.responseText)
                }
            }
        }
        /* 파일 전송을 위한 ajax통신 끝 */
    }
	
	//파일 업로드
	function startUpload(newFileListIndex){

        indicator = true;
        console.log("indicator1111: " + indicator);
        console.log("startUpload--------------- newFileListIndex: " + newFileListIndex + " ---------------");  

        // 단일 파일 제한 용량 설정
        // Tomcat은 기본적으로 Post로 전송할 데이터의 크기를 최대2MB까지 Default로 잡고있다.
        // https://youngram2.tistory.com/110
        const limitSize = 2 * 1024 * 1024;  // Byte // 약 2MB
        console.log("limitSize: " + limitSize);
        
        // 분할한 파일을 담을 배열 객체
        const slicedFiles = [];
        // 분할 전송시 사용할 index
        let slicedFileIndex = 0;
    
        /* 분할 시작 */
        // 만약, 파일용량이 제한용량보다 크면
        if(newFileList[newFileListIndex].size >= limitSize){ 
            
            // 용량에 따른 분할 수 계산
            const slicedFilesNum = Math.ceil(newFileList[newFileListIndex].size / limitSize); 
            console.log("slicedFilesNum: " + slicedFilesNum);

            // 분할
            for(let f = 0; f < slicedFilesNum; f++){
                // 각 분할 횟수별 분할 시작 포인트 설정
                const startPoint = limitSize * f;
                // slice(시작점, 자를점, Type)로 파일 분할
                const slicedFile = newFileList[newFileListIndex].slice(startPoint, startPoint + limitSize, newFileList[newFileListIndex].type);
                // 분할된 파일 slicedFiles 배열 객체에 담기
                slicedFiles.push(slicedFile);
            }
            console.log("slicedFiles : " + slicedFiles);
            console.log("slicedFiles.length : " + slicedFiles.length);
            
        }
        /* 분할 끝 */

        // 기본 파라미터 정보 담기
        let params = "&limitSize=" + limitSize;
            params += "&originName=" + newFileList[newFileListIndex].name;
            params += "&originSize=" + newFileList[newFileListIndex].size;
            params += "&originType=" + newFileList[newFileListIndex].type;

        /* 단일 파일일 경우 단일 전송 시작*/
        if(slicedFiles.length == 0){
            console.log("단일 파일 전송 시작");

            // params 추가 정보 담기
            params += "&sliced=false";
            params += "&guid=" + "0";
            params += "&slicedFilesLength=" + 0;
            
            // ajax통신 시작
            startAjax(xhttp, slicedFiles, slicedFileIndex, "0", params, newFileList, newFileListIndex);

        /* 단일 파일 전송 끝 */
        }
        
        /* 분할 파일일 경우 분할 전송 시작 */
        if(slicedFiles.length > 0){
            console.log("분할 파일 전송 시작");

            // GUID 생성
            function createGuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
                });
            }
    
            let guid = createGuid();
        
            // 기존 업로드 중단된 파일 정보들 확인
            // key: "resume_upload_" + guid
            // vlaue: guid + "__" + slicedFileIndex + "__" + newFileList[newFileListIndex].name + "__" + newFileList[newFileListIndex].size
            // 구분자: __
            let canceledFileName;
            let canceledFileSize;
            if(localStorage.length > 0){
                console.log("localStorage.length : " + localStorage.length);
                for(let l = 0; l < localStorage.length; l++){
                    console.log("localStorage.getItem(localStorage.key(l)) : " + localStorage.getItem(localStorage.key(l)));
                    canceledFileName = localStorage.getItem(localStorage.key(l)).split("__")[2];
                    canceledFileSize = localStorage.getItem(localStorage.key(l)).split("__")[3];

                    // 이어올리기 여부 체크
                    if(newFileList[newFileListIndex].name == canceledFileName && newFileList[newFileListIndex].size == canceledFileSize){
                        if(confirm("기존에 업로드된 데이터가 있습니다. 이어서 업로드하시겠습니까?")){
                            guid = localStorage.getItem(localStorage.key(l)).split("__")[0];
                            slicedFileIndex = Number(localStorage.getItem(localStorage.key(l)).split("__")[1]);
    
                            localStorage.removeItem(localStorage.key(l));
                        }else{
                            localStorage.removeItem(localStorage.key(l));
                        }
                    }
                }
            }

            // params 추가 정보 담기
            params += "&sliced=true";
            params += "&guid=" + guid;
            params += "&slicedFilesLength=" + slicedFiles.length;

            // ajax통신 시작
            console.log("slicedFileIndex: " + slicedFileIndex);
            startAjax(xhttp, slicedFiles, slicedFileIndex, guid, params, newFileList, newFileListIndex);
        
        /* 분할 파일 전송 끝 */
        }
	}

    // 업로드 중단 버튼
    function cancelUpload(){
        // // 통신 강제 중단
        // xhttp.abort();
        
        // 만약, abort()를 통해 통신을 강제 중단시켜버리면 업로드 상태가 어떨지 알 수 없기 때문에 위험하다.
        // 따라서,
        // 통신 indicator를 false로 변경해서 다음 로직을 타지 않게끔해서 비교적 안전하게 업로드를 중단해준다.
        indicator = false;
        console.log("-------------Upload was canceled-------------");
        console.log("indicatorXXXXXXXXXXXXX: " + indicator);
    }
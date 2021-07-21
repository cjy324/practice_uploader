
	//iframe window 가져오기
	//const uploadWindow = document.getElementById("upload_frame").contentWindow;
	
	//태그 가져오기
	const fileInput = document.getElementById("fileInput");
	const uploadZone = document.getElementById("uploadZone");
    const progressBarZone = document.getElementById("progressBarZone");
	const progressBar = document.getElementById("progressBar");
    const allProgressBar = document.getElementById("allProgressBar");
	const message = document.getElementById("message");
    const allMessage = document.getElementById("allMessage");
	
	//fileList를 담을 배열 객체 생성(전역변수)
	let newFileList = [];
    const newFileListIndex = 0;
	
	//버튼으로 파일추가input 불러오기
	function selectFiles() {
		fileInput.click();
	}
	
	//업로드 될 파일리스트 그리기
	function showFiles(files) {
		
		let fileListLi = ""	// dropZone에 drop한 파일별 태그 생성
        
	 	for(let i = 0; i < files.length; i++) {
		 	fileListLi += "<li>";
		 	fileListLi += "<input id='chk_file_" + [i] + "' type='checkbox'  value='false'>";
		 	fileListLi += "<span>" + files[i].name + "</span>";
		 	fileListLi += "<span> " + files[i].size + " Byte</span>";
		 	fileListLi += "</li>";
		}
		
		uploadZone.innerHTML = fileListLi;
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
    function startAjax(xhttp, slicedFiles, slicedFileIndex, params, newFileList, newFileListIndex){

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
                // states = 0 unintialized 요청이 초기화 안 된 상태
                // 1=loaded 서버 연결 설정된 상태
                // 2=loading 요청 접수된 상태
                // 3=interactive 요청 처리 중 상태
                // 4=complete 요청 완료되고 응답 준비된 상태
                if(req.status === 200) {
                    if(slicedFileIndex < slicedFiles.length-1){ // 만약, index가 slicedFiles.length 보다 작으면
                        slicedFileIndex++; // index 1 증가
                        // 재귀함수: 함수 내에서 자신을 다시 호출
                        startAjax(xhttp, slicedFiles, slicedFileIndex, params, newFileList, newFileListIndex);
                        console.log(newFileList[newFileListIndex].name + " file" + "[" + Number(slicedFileIndex+1) + "]" + "업로드 시작");
                    }
                    else if(newFileListIndex < newFileList.length-1){
                        newFileListIndex++;
                        console.log(newFileList[newFileListIndex].name + " file 업로드 시작");  
                        startUpload(newFileListIndex);
                    }              
                    console.log("업로드 - 성공")
                    console.log(xhttp.responseText)
                }else{
                    console.log("실패")
                    console.error(xhttp.responseText)
                }
            }
        }
        /* 파일 전송을 위한 ajax통신 끝 */
    }
	
	//파일 업로드
	function startUpload(newFileListIndex){

		// ajax 통신을 하기 위한 XmlHttpRequest 객체 생성
		const xhttp = new XMLHttpRequest();
        console.log("startUpload--------------- newFileListIndex: " + newFileListIndex + " ---------------");  
                
        // 단일 파일 제한 용량 설정
        // Tomcat은 기본적으로 Post로 전송할 데이터의 크기를 최대2MB까지 Default로 잡고있다.
        // https://youngram2.tistory.com/110
        const limitSize = 2 * 1024 * 1024;  // Byte // 약 2MB
        console.log("limitSize: " + limitSize);
        
        // 분할한 파일을 담을 배열 객체
        const slicedFiles = [];
        // 분할 전송시 사용할 index
        const slicedFileIndex = 0;
    
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
            params += "&guid=" + 0;
            params += "&slicedFilesLength=" + 0;
            
            // ajax통신 시작
            startAjax(xhttp, slicedFiles, slicedFileIndex, params, newFileList, newFileListIndex);

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
    
            const guid = createGuid();

            // params 추가 정보 담기
            params += "&sliced=true";
            params += "&guid=" + guid;
            params += "&slicedFilesLength=" + slicedFiles.length;

            // ajax통신 시작
            startAjax(xhttp, slicedFiles, slicedFileIndex, params, newFileList, newFileListIndex);
        
        /* 분할 파일 전송 끝 */
        }
	}
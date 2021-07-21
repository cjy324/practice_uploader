<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
<script defer src="script.js"></script>
<title>UPLOADER</title>
</head>
<body>
	<section class="main_section">
        <div class="title_bar">
            <h1>UPLOADER</h1>
        </div>
        <div id="progressBarZone">
        	<progress id='allProgressBar' value='0' max='100' style='width:70%'></progress>
        	<p id="allMessage"></p>
	        <progress id="progressBar" value="0" max="100" style="width:70%"></progress>
	        <p id="message"></p>
        </div>
        <div class="uploader_body">
            <div id="top_area" class="top_area">
                <input type="checkbox">
                <div>파일 이름</div>
                <div>파일 크기</div>
            </div>
            <div id="upload_area" class="upload_area">
				<input id="fileInput" type='file' onchange="setUploadFiles(event)" name='userfile' multiple style="display: none;">
				
				<ul class="uploadZone" id="uploadZone"></ul>
            </div>
            <div id="info_area" class="info_area">
                <ul>
                    <li id="basic_file_info" class="basic_file_info">
                        최대
                        <span>20</span>
                        개
                        <span>300 MB</span>
                        제한
                    </li>
                    <li id="current_file_info" class="current_file_info">
                        <span>0</span>
                        개 ,
                        <span>0 byte</span>
                        <span>추가됨</span>
                    </li>
                </ul>
            </div>
            <div id="btn_area" class="btn_area">
                <table>
                    <tbody>
                        <tr>
                            <td>
                            	<button type="button" id="button_add" onclick="selectFiles()">
                            		<span>파일추가</span>
                            	</button>
                            	<button type="button" id="button_send" onclick="startUpload(0)">
                            		<span>전송하기</span>
                            	</button>
                                <button type="button">
                                    <span>항목제거</span>
                                </button>
                                <button type="button">
                                    <span>전체 제거</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
 		<div id="uploaded_body" class="uploaded_body">
    		<!-- <iframe class="uploaded_frame" src="fileUpload.jsp" frameborder="0"></iframe> -->
    	</div>
    </section>
<!-- <script type="text/javascript">



//iframe window 가져오기
//const uploadWindow = document.getElementById("upload_frame").contentWindow;

//태그 가져오기
const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const progressBar = document.getElementById("progressBar");
const message = document.getElementById("message");

//fileList를 담을 배열 객체 생성
let newFileList = [];

//file 전송 정보를 담을 formData 객체 생성
const formData = new FormData()

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

// 콜백 함수
function callbackTest(){
    alert("callBackTest!!!!!")
}


//파일 전송
function startUpload(e){
	// ajax를 하기 위한 XmlHttpRequest 객체
	const xhttp = new XMLHttpRequest(); 
	
	// progressBar
    xhttp.upload.onloadstart = function (e) {
 		progressBar.value = 0;
 		progressBar.max = e.total;
 		message.textContent = "uploading...";
	};
	xhttp.upload.onprogress = function (e) {
		progressBar.value = e.loaded;
		progressBar.max = e.total;
	};
	xhttp.upload.onloadend = function (e) {
		message.textContent = "upload complete!!";
	};

	for(let i = 0; i < newFileList.length; i++){	
		console.log(newFileList[i]);
 		    	
	 	// 단일 파일 제한 용량 설정
	 	const limitSize = 50*1024*1024;  // Byte //50MB
	 	// 분할한 파일을 담을 배열 객체
	 	const slicedFiles = [];
 	
	 	/* 분할 시작 */
	 	// 만약, 파일용량이 제한용량보다 크면
	 	if(newFileList[i].size >= limitSize){ 
	 		// 용량에 따른 분할 수 계산
	 		const slicedFilesNum = Math.ceil(newFileList[i].size / limitSize); 
	 		
	 		console.log(slicedFilesNum);
	 		console.log(limitSize);
	 		
	 		// 2자리 수로 만드는 함수
	 		function numFormat(num) {
	 			num = Number(num).toString(); 
	 			if(Number(num) < 10 && num.length == 1){
	 				num = "0" + num;
	 			}
	 			return num;
	 		}

	 		// 분할
	 		for(let f = 0; f < slicedFilesNum; f++){
	 			// 각 분할 횟수별 분할 시작 포인트 설정
	 			const startPoint = limitSize * f;
	 			// slice(시작점, 자를점, Type)로 파일 분할
	 			const slicedFile = newFileList[i].slice(startPoint, startPoint + limitSize, newFileList[i].type);
	 			// 분할된 파일 slicedFiles 배열 객체에 담기
	 			slicedFiles.push(slicedFile);
	 		}
	 		console.log(slicedFiles);
	 		console.log(slicedFiles.length);
	 	    
	 	}
	 	/* 분할 끝 */
 
 	
	 	/* 분할 파일 전송 시작 */
	 	if(slicedFiles.length !== 0){
	 		
	 		// GUID 생성
	 		function createGuid() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
				});
			}
	 		
	 		const guid = createGuid();
            const index = 0;

            // 분할 파일별 이름을 설정
            slicedFiles[index].name = "temp." + numFormat(index);
            // 각 file을 formData 객체에 담기
            formData.set("slicedFiles", slicedFiles[index]);
                
            // param 정보 담기
            let params = "&guid=" + guid;
                params += "&limitSize=" + limitSize;
                params += "&originName=" + newFileList[i].name;
                params += "&originSize=" + newFileList[i].size;
                params += "&originType=" + newFileList[i].type;
                params += "&index=" + index;
                params += "&slicedFilesLength=" + slicedFiles.length;
            
            // http 요청 타입 / 주소 / 동기식 여부 설정
            xhttp.open("POST", "http://localhost:8086/upload/usr/server?sliced=true" + params, true); // 메서드와 주소 설정
            // http 요청
            xhttp.send(formData);   // 요청 전송(formData 전송)

            // XmlHttpRequest의 요청
            xhttp.onreadystatechange = function(e){   // 요청에 대한 콜백
                // XMLHttpRequest를 이벤트 파라미터에서 취득
                const req = e.target;
                console.log(req);   // 콘솔 출력  
                
             // 콜백 함수로 다루기
                // 콜백은 단순히 메소드로 돌아온 응답을 처리하도록 지정된 메소드
                if(xhttp.readyState === 4){ //응답을 모두 받은 상태
                    callbackTest();
                    if(!index == slicedFiles.length-1){
                        formData.set("slicedFiles", slicedFiles[index++]);
                        xhttp.send(formData);
                        console.log(index);
                    }
                }
        
                // 통신 상태가 완료가 되면...
                if(req.readyState === XMLHttpRequest.DONE) {    // 요청이 완료되면
                    // Http response 응답코드가 200(정상)이면..
                    if(req.status === 200) {
                        console.log("분할 업로드 - 성공")
                        //console.log(xhttp.responseText)
                        // 업로드 완료 후 formData 초기화
                        /* formData.delete("slicedFiles"); */
                        // 업로드 완료 창 iframe으로 넣기
                        /* const uploaded_frame = '<iframe class="uploaded_frame" src="fileUpload.jsp" frameborder="0"></iframe>';
                        document.getElementById("uploaded_body").innerHTML = uploaded_frame; */
                    }else{
                        console.log("실패")
                        //console.error(xhttp.responseText)
                    }
                }
            }
	 		
	 		// // 분할 파일 수 만큼 반복
	 		// for(let k = 0; k < slicedFiles.length; k++){
	 		// }
	 	/* 분할 파일 전송 끝 */
 	
	 	/* 단일 파일 전송 시작 */
	 	}else{
	 		// 각 file을 formData 객체에 담기
	        formData.set("files", newFileList[i]);
    		
	     	// http 요청 타입 / 주소 / 동기식 여부 설정
		    xhttp.open("POST", "http://localhost:8086/upload/usr/server?sliced=false&originSize=" + newFileList[i].size, false); // 메서드와 주소 설정
		    // http 요청
		    xhttp.send(formData);   // 요청 전송(formData 전송)
		 	// XmlHttpRequest의 요청
		    xhttp.onreadystatechange = function(e){   // 요청에 대한 콜백
		        // XMLHttpRequest를 이벤트 파라미터에서 취득
		        const req = e.target;
		        console.log(req);   // 콘솔 출력
		
		        // 통신 상태가 완료가 되면...
		        if(req.readyState === XMLHttpRequest.DONE) {    // 요청이 완료되면
		            // Http response 응답코드가 200(정상)이면..
		            if(req.status === 200) {
		                console.log("단일 업로드 - 성공")
		                console.log(xhttp.responseText)
		                // 업로드 완료 후 formData 초기화
		                /* formData.delete("files"); */
		                // 업로드 완료 창 iframe으로 넣기
		                /* const uploaded_frame = '<iframe class="uploaded_frame" src="fileUpload.jsp" frameborder="0"></iframe>';
		                document.getElementById("uploaded_body").innerHTML = uploaded_frame; */
		            }else{
		            	console.log("실패")
		                console.error(xhttp.responseText)
		            }
		        }
		    }
	 	}
	 	/* 단일 파일 전송 끝 */
 }
	
	 
}

</script> -->

</body>
</html>
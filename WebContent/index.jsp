<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
<script defer src="script.js"></script>
<title>UPLOADER & DOWNLOADER</title>
<script type="text/javascript">
	let testVal = 10000;
</script>
</head>
<body onload="fileLoad()">
	<section class="main_section">
		<!-- UPLOADER -->
        <div class="title_bar">
            <h1>UPLOADER</h1>
        </div>
        <div id="progressBarZone">
        	<p id="allFilesMessage" style="font-weight: bold;"></p>
        	<span style="font-size: 14px;">총 진행률</span>
        	<progress id='allFilesProgressBar' value='0' max='100' style='width:50%'></progress>
        	<br/>
        	<br/>
        	<span style="font-size: 14px;">파일별 총 진행률</span>
        	<progress id='allProgressBar' value='0' max='100' style='width:50%'></progress>
        	<p id="allMessage"></p>
        	<span style="font-size: 14px;">분할파일별 진행률</span>
	        <progress id="progressBar" value="0" max="100" style="width:50%"></progress>
	        <p id="message"></p>
        </div>
        <div class="uploader_body">
            <div id="top_area" class="top_area">
                <input id="allCheckbox" type="checkbox" checked="checked" onchange="setAllCheckbox()">
                <div>파일 이름</div>
                <div>파일 크기</div>
            </div>
            <div id="upload_area" class="upload_area">
				<input id="fileInput" type='file' onchange="setUploadFiles(event)" name='userfile' multiple style="display: none;">
				<ul class="uploadZone" id="uploadZone">
					<li style="height:100%; justify-content: center; align-items: center;">
						<span style="font-weight: normal; color: blue; font-size: 12px;">이곳에 파일을 Drag & Drop 하세요.</span>
					</li>
				</ul>
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
                            	<button type="button" id="button_send" onclick="setUploadFileList()">
                            		<span>업로드</span>
                            	</button>
                                <button type="button" id="button_cancel" onclick="cancelUpload()">
                            		<span>업로드 중단</span>
                            	</button>
                            	<button type="button" id="button_remove" onclick="removeSelectedFiles()">
                            		<span>선택 삭제</span>
                            	</button>
                            	<button type="button" id="button_removeAll" onclick="selectAllFilesAndRemove()">
                            		<span>전체 삭제</span>
                            	</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 21.07.29 임시 삭제 -->
        <!-- <div class="title_bar">
            <h5>UPLOADED FILE LIST</h5>
        </div>
 		<div id="uploaded_body" class="uploaded_body">
    		<ul id="uploadedZone" class="uploadedZone"></ul>
    	</div> -->
    	
    	
    	<!-- DOWNLOADER -->
    	<p>-------------------------------------------------------------------------------------</p>
    	<div class="title_bar">
            <h1>DOWNLOADER</h1>
        </div>
        <div class="downloader_body">
            <div id="top_area" class="top_area">
                <input type="checkbox" checked="checked">
                <div>파일 이름</div>
                <div>파일 크기</div>
            </div>
            <div id="download_area" class="download_area">
				<ul id="downloadZone" class="downloadZone"></ul>
            </div>
            <div id="info_area" class="info_area">
                <ul>
                    <li id="current_file_info" class="current_file_info">
                        <span>3</span>
                        개 ,
                        <span>230000 byte</span>
                        <span>추가됨</span>
                    </li>
                </ul>
            </div>
            <div id="btn_area" class="btn_area">
                <table>
                    <tbody>
                        <tr>
                            <td>
                            	<button id="button_down" type="button" onclick="startDownload(0)">
                            		<span>다운로드</span>
                            	</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="progressBarZone_down" style="margin: 20px;">
        	<p id="allFilesMessage_down" style="font-weight: bold;"></p>
        	<span style="font-size: 14px;">총 진행률</span>
        	<progress id='allFilesProgressBar_down' value='0' max='100' style='width:50%'></progress>
        	<br/>
        	<br/>
        	<span style="font-size: 14px;">파일별 진행률</span>
	        <progress id="progressBar_down" value="0" max="100" style="width:50%"></progress>
	        <p id="message_down"></p>
        </div>
        <iframe id="download_frame" name="download_frame" style="display: none;" src=""></iframe>
        
        
        <!-- MODIFY -->
    	<p>-------------------------------------------------------------------------------------</p>
    	<div class="title_bar">
            <h1>MODIFY</h1>
        </div>
        <div id="progressBarZone">
        	<p id="allFilesMessage" style="font-weight: bold;"></p>
        	<span style="font-size: 14px;">총 진행률</span>
        	<progress id='allFilesProgressBar' value='0' max='100' style='width:50%'></progress>
        	<br/>
        	<br/>
        	<span style="font-size: 14px;">파일별 총 진행률</span>
        	<progress id='allProgressBar' value='0' max='100' style='width:50%'></progress>
        	<p id="allMessage"></p>
        	<span style="font-size: 14px;">분할파일별 진행률</span>
	        <progress id="progressBar" value="0" max="100" style="width:50%"></progress>
	        <p id="message"></p>
        </div>
        <div class="uploader_body">
            <div id="top_area" class="top_area">
                <input id="allCheckbox" type="checkbox" checked="checked" onchange="setAllCheckbox()">
                <div>파일 이름</div>
                <div>파일 크기</div>
            </div>
            <div id="upload_area" class="upload_area">
				<input id="fileInput" type='file' onchange="setUploadFiles(event)" name='userfile' multiple style="display: none;">
				<ul class="uploadZone" id="uploadZone">
					<li style="height:100%; justify-content: center; align-items: center;">
						<span style="font-weight: normal; color: blue; font-size: 12px;">이곳에 파일을 Drag & Drop 하세요.</span>
					</li>
				</ul>
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
                            	<button type="button" id="button_send" onclick="setUploadFileList()">
                            		<span>업로드</span>
                            	</button>
                                <button type="button" id="button_cancel" onclick="cancelUpload()">
                            		<span>업로드 중단</span>
                            	</button>
                            	<button type="button" id="button_remove" onclick="removeSelectedFiles()">
                            		<span>선택 삭제</span>
                            	</button>
                            	<button type="button" id="button_removeAll" onclick="selectAllFilesAndRemove()">
                            		<span>전체 삭제</span>
                            	</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</body>
</html>

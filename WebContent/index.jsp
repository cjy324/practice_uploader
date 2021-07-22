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
                                <button type="button" id="button_cancel" onclick="cancelUpload()">
                            		<span>업로드 중단</span>
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
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.net.URLEncoder" %>
<%
int index = (int) request.getAttribute("index");
String guid = (String) request.getAttribute("guid");
String originName = (String) request.getAttribute("originName");
long originSize = (long) request.getAttribute("originSize");
String originPath = (String) request.getAttribute("originPath");

/* HTTP 헤더 셋팅 시작 */
response.reset();

// IE체크
if(request.getHeader("User-Agent").indexOf("MSIE5.0") > -1) {
	// IE가 아닌 경우
	response.setHeader("Content-Type", "dosen/matter;");
}else {
	// IE인 경우
	response.setHeader("Content-Type", "application/unknown");
}
response.setHeader("Content-Disposition",
        "attachment; filename=\"" + URLEncoder.encode(originName, "UTF-8") + "\"");
/* HTTP 헤더 셋팅 끝 */


/* 파일 다운로드(브라우저로 전송) 시작 */
File file = new File(originPath);
int read = 0;

byte[] bytes = new byte[(int) originSize];


BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
ServletOutputStream sos = response.getOutputStream();
BufferedOutputStream bos = new BufferedOutputStream(sos);
// 파일 읽어서 브라우저로 출력
while((read=bis.read(bytes)) != -1) {
	bos.write(bytes, 0, read);
}

bos.flush();

bis.close();
sos.close();
bos.close();
/* 파일 다운로드(브라우저로 전송) 끝 */
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title> DOWNLOADER</title>
</head>
<body>
<h1>테스트</h1>
</body>
</html>
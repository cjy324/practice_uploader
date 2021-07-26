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
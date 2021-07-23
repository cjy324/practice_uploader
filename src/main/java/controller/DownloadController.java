package controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class DownloadController {
	
		public String server(HttpServletRequest request, HttpServletResponse response) throws IOException {
			// 파일에 대한 정보를 parameter로 받기
			int index = Integer.parseInt(request.getParameter("index"));
			String guid = request.getParameter("guid");
			String originName = request.getParameter("originName");
			long originSize = Long.parseLong(request.getParameter("originSize"));
			String originPath = request.getParameter("originPath");
			
			// (테스트용)
			System.out.println("index : " + index);
			System.out.println("guid : " + guid);
			System.out.println("originName : " + originName);
			System.out.println("originSize : " + originSize);
			System.out.println("originPath : " + originPath);
			
			return null;
		}
}

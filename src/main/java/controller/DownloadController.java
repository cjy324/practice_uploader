package controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.ServletOutputStream;
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
			
			
			
			response.getOutputStream().close();
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
			
			
			
			return "download";
		}
}

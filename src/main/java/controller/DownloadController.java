package controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;

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
			String originType = request.getParameter("originType");
			
			// (테스트용)
			System.out.println("index : " + index);
			System.out.println("guid : " + guid);
			System.out.println("originName : " + originName);
			System.out.println("originSize : " + originSize);
			System.out.println("originPath : " + originPath);
			System.out.println("originType : " + originType);
			
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
			
			// 파일 임시 업로드 경로 설정
			String tempPath = request.getServletContext().getRealPath("temp");
			System.out.println("tempPath : " + tempPath); //(테스트용)

			File tempDir = new File(tempPath);
			if(!tempDir.exists()){	// 만약, tempPath 경로에 폴더가 없으면 폴더 생성
				tempDir.mkdirs();
			};
			
			// 다운로드 상태를 임시 저장해 놓을 txt파일 생성
			String tempTxtPath = tempPath + "\\" + guid + ".txt";
			File tempTxtFile = new File(tempTxtPath);			
			tempTxtFile.createNewFile();
			FileOutputStream fos = new FileOutputStream(tempTxtFile);
			
			/* 파일 다운로드(브라우저로 전송) 시작 */
			File file = new File(originPath);
			int read = 0;
			long count = 0;
			
			byte[] bytes = new byte[1024]; //(int) originSize
			
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
			BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream());
			// 파일 읽어서 브라우저로 출력
			while((read=bis.read(bytes)) != -1) {
				bos.write(bytes, 0, read);
				count++;
				// 임시 txt파일에 현재 다운로드된 byte 크기 쓰기
				if(tempTxtFile.exists()) {
					String state = (count*1024) + " / " + originSize + "__";
					fos.write(state.getBytes());
				}
				
			}

			bos.flush();
			// 자원 사용 종료
			fos.close(); 
			bis.close();
			bos.close();
			/* 파일 다운로드(브라우저로 전송) 끝 */
			
			
			
			return "download";
		}
}

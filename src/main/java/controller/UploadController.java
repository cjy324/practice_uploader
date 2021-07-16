package controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;


public class UploadController {
	
		public String server(HttpServletRequest request, HttpServletResponse response) throws IOException {
			
			int sizeLimit = 15*1024*1024;  // 15MB
			String encType = "UTF-8";
			
			String isSliced = request.getParameter("sliced");
			System.out.println(isSliced);
			
			String realPath = request.getServletContext().getRealPath("upload");
			System.out.println(realPath);
			
			
//			// 파일 스트림 읽기
//			BufferedReader reader = new BufferedReader(new InputStreamReader(
//				    request.getInputStream()));
//				  for (String line; (line = reader.readLine()) != null;) {
//				   System.out.println(line);
//			}


			// 실제 파일을 업로드할 경로 설정
			File dir = new File(realPath);
			if(!dir.exists()){	// 만약, realPath 경로에 폴더가 없으면 폴더 생성
				dir.mkdirs();
			};
			
			// 분할 파일인 경우 
			if(isSliced != null && isSliced.equals("true")) {
				
				String guid = request.getParameter("guid");
				int originSize = Integer.parseInt(request.getParameter("size"));
				String originType = request.getParameter("type");
				int index = Integer.parseInt(request.getParameter("index"));
				String length = request.getParameter("length");
				
				System.out.println(guid);
				System.out.println(originSize);
				System.out.println(originType);
				System.out.println(index);
				System.out.println(length);
				
				// 1. 실제 분할 파일들을 담을 임시 파일 생성(최초 1회)
				String tempPath = realPath + "\\" + guid;
				File temp = new File(tempPath);
				if(index == 0) {
					temp.createNewFile();
				}
				
				System.out.println(temp.getPath());
				
				// Multipart로 요청 받기 위한 객체 생성
				// temp파일 개념으로 분할 파일 생성
				MultipartRequest multiReq = new MultipartRequest(
								request, 
								realPath, // 파일을 저장할 디렉토리(폴더) 지정
								sizeLimit, // 첨부파일 최대 용량 설정(bite)
								encType, // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				// 각 파일별 이름 받아오기
				String fileName = multiReq.getFilesystemName("slicedFiles");
				System.out.println(fileName);
				
				// 2. GUID명 파일에 분할 파일들 정보 쓰기
//				RandomAccessFile raf = new RandomAccessFile(temp, "rw"); // read/write 랜덤 액세스 파일로 연다
//					raf.seek(dis.readByte());
////					byte[] data = "testData".getBytes();
//					raf.write(dis.read());
//					raf.close();// 파일의 10byte 뒤부터 읽어온다.  
	
//				OutputStream opStream;
//				try {
//					opStream = new FileOutputStream(tempPath);
//					byte[] bts = tempPath.getBytes(); // 문자열을 byte배열에 담음
//					try {
//						opStream.write(bts);
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//					try {
//						opStream.close(); // 꼭 닫아줘야 함
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//				} catch (FileNotFoundException e1) {
//					// TODO Auto-generated catch block
//					e1.printStackTrace();
//				}

			}else {
				// Multipart로 요청 받기 위한 객체 생성
				MultipartRequest multiReq = new MultipartRequest(
						request, 
						realPath, // 파일을 저장할 디렉토리 지정
						sizeLimit, // 첨부파일 최대 용량 설정(bite)
						encType, // 인코딩 방식 지정
						new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
					);

				// 각 파일별 이름 받아오기
				String fileName = multiReq.getFilesystemName("files");
				System.out.println(fileName);
			
			}
			return null;
		}	
}

package controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.RandomAccessFile;

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
			
			
//			// 파일 스트림 읽기(테스트용)
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
				
				// 파일에 대한 정보를 parameter로 받기
				String guid = request.getParameter("guid");
				int originSize = Integer.parseInt(request.getParameter("size"));
				String originType = request.getParameter("type");
				int index = Integer.parseInt(request.getParameter("index"));
				String length = request.getParameter("length");
				
				// (테스트용)
				System.out.println("guid : " + guid);
				System.out.println("originSize : " + originSize);
				System.out.println("originType" + originType);
				System.out.println("index : " + index);
				System.out.println("arrayLength : " + length);
				
				// 분할 파일을 담을 임시 파일 생성
				String tempPath = realPath + "\\" + guid;
				File temp = new File(tempPath);
				// seekpoint정보를 임시 저장해 놓을 txt파일 생성
				String tempPathPath = realPath + "\\" + guid + ".txt";
				File tempPathTxt = new File(tempPathPath);
								
				if(index == 0) { // 만약, 들어온 분할 파일이 첫번째 분할 파일일 경우
					temp.createNewFile(); // 실제 분할 파일들을 담을 임시 파일 생성(최초 1회)
					tempPathTxt.createNewFile(); // seekpoint정보를 임시 저장해 놓을 txt 파일
				}
				
				System.out.println("tempPath : " + temp.getPath()); //(테스트용)
				
				// Multipart로 요청 받기 위한 객체 생성
				// temp파일 개념으로 분할 파일 생성
				MultipartRequest multiReq = new MultipartRequest(
								request, 
								realPath, // 파일을 저장할 디렉토리(폴더) 지정
								sizeLimit, // 첨부파일 최대 용량 설정(byte)
								encType, // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				// 각 파일별 이름 받아오기(테스트용)
				String fileName = multiReq.getFilesystemName("slicedFiles");				 
				System.out.println(fileName);
				
				// 새로 들어온 분할 파일 객체 생성
				File newFile = multiReq.getFile("slicedFiles");
			
				System.out.println("newFile : " + newFile.getName()); //(테스트용)
			
				// 새로 들어온 분할 파일 읽기
				FileInputStream fr = new FileInputStream(newFile);
				int fileByte;
				// RandomAccessFile로 분할 파일들을 담을 임시파일 객체 생성(read/write)
				RandomAccessFile raf = new RandomAccessFile(temp, "rw"); 
				
				long seekPoint = 0; // seekPoint 설정
				
				// 만약, 기존에 seekpoint정보를 임시 저장해 놓은 txt파일이 존재할 경우..
				// 임시 txt파일에 저장해둔 seekPoint 값 가져오기
				if(tempPathTxt.exists()) {
					String getSeekPoint = "";
					BufferedReader br = new BufferedReader(new FileReader(tempPathTxt));
					
					while((getSeekPoint = br.readLine()) != null) {
						seekPoint = Long.parseLong(getSeekPoint);
					}
					br.close(); // 자원 사용 종료
				}
				
				// seekPoint 설정
				raf.seek(seekPoint); 

				// 1바이트씩 읽으면서 파일쓰기
				while((fileByte = fr.read()) != -1) {
					raf.write(fileByte); // 파일쓰기
				}
//				System.out.println("data.length() : " + data.length());
				System.out.println("fileByte : " + fileByte); //(테스트용)
				
				
				// 현재 파일을 쓴 바이트 크기만큼 seekPoint 값 증가
				long addedSeekPoint = seekPoint + newFile.length();
				// 현재 분할 파일의 데이터 크기만큼 seekPoint를 증가시키고 
				// 이 정보를 임시 txt파일에 기록
				if(tempPathTxt.exists()) {
					FileOutputStream fos = new FileOutputStream(tempPathTxt);
					fos.write(Long.toString(addedSeekPoint).getBytes());
					fos.close(); // 자원 사용 종료
				}
				
				
				
				// (테스트용)
				System.out.println("getFilePointer : " + raf.getFilePointer());
				System.out.println("addedSeekPoint : " + addedSeekPoint);
				System.out.println("-------------------------------------------");
				
				raf.close(); // 자원 사용 종료
				fr.close(); // 자원 사용 종료
				
				// 분할 파일 삭제
				if(newFile.exists()) {
					newFile.delete();
					System.out.println(newFile.getName() + " 삭제 완료");
				}
				
				// 모든 분할 파일 업로드가 완료 되었을 경우 임시 txt파일 삭제
				if(addedSeekPoint == originSize && tempPathTxt.exists()) {
					tempPathTxt.delete();
					System.out.println(tempPathTxt.getName() + " 삭제 완료");
				}
				
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

package controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
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

//			// 파일 스트림 읽기(테스트용)
//			BufferedReader reader = new BufferedReader(new InputStreamReader(
//				    request.getInputStream()));
//				  for (String line; (line = reader.readLine()) != null;) {
//				   System.out.println(line);
//			}

			// 파일 실제 업로드 경로 설정
			String realPath = request.getServletContext().getRealPath("upload");
			System.out.println("realPath : " + realPath); //(테스트용)
			
			File uploadDir = new File(realPath);
			if(!uploadDir.exists()){	// 만약, realPath 경로에 폴더가 없으면 폴더 생성
				uploadDir.mkdirs();
			};
			
			// 파일 임시 업로드 경로 설정
			String tempPath = request.getServletContext().getRealPath("temp");
			System.out.println("tempPath : " + tempPath); //(테스트용)

			File tempDir = new File(tempPath);
			if(!tempDir.exists()){	// 만약, tempPath 경로에 폴더가 없으면 폴더 생성
				tempDir.mkdirs();
			};
			
			// 분할 파일 여부 체크
			String isSliced = request.getParameter("sliced");
			System.out.println("isSliced? : " + isSliced); //(테스트용)
			
			// 분할 파일인 경우...
			if(isSliced != null && isSliced.equals("true")) {
				
				// 파일에 대한 정보를 parameter로 받기
				String guid = request.getParameter("guid");
				Long limitSize = Long.parseLong(request.getParameter("limitSize"));
				String originName = request.getParameter("originName");
				Long originSize = Long.parseLong(request.getParameter("originSize"));
				String originType = request.getParameter("originType");
				int index = Integer.parseInt(request.getParameter("index"));
				int slicedFilesLength = Integer.parseInt(request.getParameter("slicedFilesLength"));
				
				// (테스트용)
				System.out.println("guid : " + guid);
				System.out.println("limitSize : " + limitSize);
				System.out.println("originName : " + originName);
				System.out.println("originSize : " + originSize);
				System.out.println("originType : " + originType);
				System.out.println("index : " + index);
				System.out.println("slicedFilesLength : " + slicedFilesLength);
				
				// 분할 파일을 담을 실제 파일 경로
				String NewFileLocation = realPath + "\\" + guid;
				
				// 실제 업로드파일 저장경로, 원본파일명 등을 임시 저장해 놓을 txt파일 생성
				String tempTxtPath = tempPath + "\\" + guid + ".txt";
				File tempTxtFile = new File(tempTxtPath);
								
				// 만약, 들어온 분할 파일이 첫번째 분할 파일일 경우
				if(index == 0) { 
					// 실제 분할 파일을 담을 빈파일을 size 지정해서 생성(최초 1회)
					RandomAccessFile raf = new RandomAccessFile(NewFileLocation, "rw");

					raf.setLength(originSize);	// 파일의 크기를 지정된 길이로 변경한다.(단위 byte) 
					raf.close(); // 자원 사용 종료
					
					tempTxtFile.createNewFile(); // 실제 업로드파일 저장경로, 원본파일명 등을 임시 저장해 놓을 txt파일 생성
					
					// 원본 파일에 대한 정보를 임시 txt파일에 기록
					if(tempTxtFile.exists()) {
						FileOutputStream fos = new FileOutputStream(tempTxtFile);
						fos.write(NewFileLocation.getBytes());
						fos.close(); // 자원 사용 종료
					}
				}
				
				// Multipart로 요청 받기 위한 객체 생성
				// 분할 파일을 temp폴더에 생성
				MultipartRequest multiReq = new MultipartRequest(
								request, 
								tempPath, // 파일을 임시 저장할 디렉토리(폴더) 지정
								sizeLimit, // 첨부파일 최대 용량 설정(byte)
								encType, // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				
				// 새로 들어온 분할 파일 객체 생성
				File newFile = multiReq.getFile("slicedFiles");
				System.out.println("newFile : " + newFile.getName()); //(테스트용)
			
				// 새로 들어온 분할 파일 읽기
				FileInputStream fr = new FileInputStream(newFile);
				int fileByte;
				// RandomAccessFile로 분할 파일들을 담을 임시파일 가져오기(read/write)
				RandomAccessFile raf = new RandomAccessFile(NewFileLocation, "rw");
				
				long seekPoint = index * limitSize; // seekPoint 설정
				// seekPoint 설정
				raf.seek(seekPoint); 
				// 1바이트씩 읽으면서 파일쓰기
				while((fileByte = fr.read()) != -1) {
					raf.write(fileByte); // 파일쓰기
				}

				// (테스트용)
				System.out.println("getFilePointer : " + raf.getFilePointer());

				raf.close(); // 자원 사용 종료
				fr.close(); // 자원 사용 종료
				
				// 분할 파일 삭제
				if(newFile.exists()) {
					newFile.delete();
					System.out.println(newFile.getName() + " 삭제 완료");
				}
				System.out.println("-------------------------------------------");

				// 모든 분할 파일 업로드가 완료 되었을 경우
				if(index + 1 == slicedFilesLength && tempTxtFile.exists()) {
					// 1. 파일명 원본 파일명으로 변경
					File uploadedFile = new File(NewFileLocation);
					File originFileName = new File(realPath + "\\" + originName);
					uploadedFile.renameTo(originFileName);
					// 2. 임시 txt파일 삭제
					tempTxtFile.delete();
					System.out.println("\"" + originName + "\"" + " 업로드 완료");
				}
				
			}else {	// 단일 파일인 경우
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

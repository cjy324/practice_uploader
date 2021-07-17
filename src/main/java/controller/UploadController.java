package controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;

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
				
				System.out.println("guid : " + guid);
				System.out.println("originSize : " + originSize);
				System.out.println("originType" + originType);
				System.out.println("index : " + index);
				System.out.println("arrayLength : " + length);
				
				
				String tempPath = realPath + "\\" + guid;
				File temp = new File(tempPath);
				String tempPathPath = realPath + "\\" + guid + ".txt";
				File tempPathTxt = new File(tempPathPath);
								
				if(index == 0) {
					temp.createNewFile(); // 1. 실제 분할 파일들을 담을 임시 파일 생성(최초 1회)
					tempPathTxt.createNewFile(); // seekpoint정보를 임시 저장해 놓을 txt 파일
				}
				
				System.out.println("tempPath : " + temp.getPath());
				
				// Multipart로 요청 받기 위한 객체 생성
				// temp파일 개념으로 분할 파일 생성
				MultipartRequest multiReq = new MultipartRequest(
								request, 
								realPath, // 파일을 저장할 디렉토리(폴더) 지정
								sizeLimit, // 첨부파일 최대 용량 설정(byte)
								encType, // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				// 각 파일별 이름 받아오기
				String fileName = multiReq.getFilesystemName("slicedFiles");				 
				System.out.println(fileName);
				
				// 새로 들어온 분할 파일 정보 읽기
				File newFile = multiReq.getFile("slicedFiles");
			
				System.out.println("newFile : " + newFile.getName());
			
				FileInputStream fr = new FileInputStream(newFile);
				int read;
				byte[] buffer = new byte[1024]; // 파일 내용을 담을 버퍼(?) 선언
				String stringData = null;
				StringBuilder data = new StringBuilder();
				while((read = fr.read(buffer)) != -1) {
					stringData = new String(buffer, 0, read);
					//System.out.println(stringData);
					data.append(stringData);
				}
				System.out.println("data.length() : " + data.length());
				
				// read/write 랜덤 액세스 파일 열기
				RandomAccessFile raf = new RandomAccessFile(temp, "rw"); 
				
				long seekPoint = 0;
				
				// 임시 txt파일에 저장해둔 seekPoint 값 가져오기
				if(tempPathTxt.exists()) {
//					String test = Files.readString(tempPathTxt.toPath());
					String getSeekPoint = "";
					BufferedReader br = new BufferedReader(new FileReader(tempPathTxt));
					
					while((getSeekPoint = br.readLine()) != null) {
						seekPoint = Long.parseLong(getSeekPoint);
					}
					br.close();
				}
				
				raf.seek(seekPoint); // seekPoint 설정
				raf.writeBytes(data.toString()); // 파일쓰기
				
				System.out.println("getFilePointer : " + raf.getFilePointer());
				System.out.println("seekPoint : " + seekPoint);
				System.out.println("-------------------------------------------");
				
				// 현재 분할 파일의 데이터 크기만큼 seekPoint를 증가시키고 
				// 이 정보를 임시 .txt파일에 기록
				if(tempPathTxt.exists()) {
					FileOutputStream fos = new FileOutputStream(tempPathTxt);
					fos.write(Long.toString(seekPoint + data.length()).getBytes());		
					fos.close();
				}
				
				raf.close();
				fr.close(); 

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

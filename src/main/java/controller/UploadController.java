package controller;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

public class UploadController {
	
		public String server(HttpServletRequest request, HttpServletResponse response) {
			
			
			String isSliced = request.getParameter("sliced");
			String guid = request.getParameter("guid");
			String originSize = request.getParameter("size");
			String length = request.getParameter("length");
			
			System.out.println(isSliced);
			System.out.println(guid);
			System.out.println(originSize);
			System.out.println(length);
			
			String realPath = request.getServletContext().getRealPath("upload");
			System.out.println(realPath);
			
			// 실제 파일을 업로드할 경로 설정
			File dir = new File(realPath);
			if(!dir.exists()){	// 만약, realPath 경로에 폴더가 없으면 폴더 생성
				dir.mkdirs();
			};
			
			// 분할 파일인 경우 
			if(isSliced != null && isSliced.equals("true")) {
				// 임시 파일 생성
				String tempPath = realPath + "\\" + guid;
				File temp = new File(tempPath);
				try {
					temp.createNewFile();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				
				System.out.println(temp.getAbsolutePath());
				System.out.println(temp.getPath());
				
				
				int sizeLimit = 15*1024*1024;  // 15MB
				
				// Multipart로 요청 받기 위한 객체 생성
				MultipartRequest multiReq = null;
				try {
					multiReq = new MultipartRequest(
								request, 
								temp.getPath(), // 파일을 저장할 디렉토리 지정
								sizeLimit, // 첨부파일 최대 용량 설정(bite)
								"utf-8", // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
					// 각 파일별 이름 받아오기
					String fileName = multiReq.getFilesystemName("slicedFiles");
					System.out.println(fileName);		
					
				
				//return null;
			}else {
				//첨부파일 최대 용량 설정
				int sizeLimit = 15*1024*1024;  // 15MB
				
				
				// Multipart로 요청 받기 위한 객체 생성
				MultipartRequest multiReq = null;
				try {
					multiReq = new MultipartRequest(
								request, 
								realPath, // 파일을 저장할 디렉토리 지정
								sizeLimit, // 첨부파일 최대 용량 설정(bite)
								"utf-8", // 인코딩 방식 지정
								new DefaultFileRenamePolicy() // 중복 파일 처리(동일한 파일명이 업로드되면 뒤에 숫자 등을 붙여 중복 회피)
							);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				// 각 파일별 이름 받아오기
				String fileName = multiReq.getFilesystemName("files");
				System.out.println(fileName);
			}

			return null;
		}
}

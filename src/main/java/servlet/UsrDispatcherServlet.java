package servlet;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import container.Container;
import controller.DownloadController;
import controller.UploadController;

@WebServlet("/usr/*")
public class UsrDispatcherServlet extends DispatcherServlet {

	// (2) doBeforeActionRs의 결과로 도출된 controllerName, actionMethodName 가져와 usr, adm 서블릿으로 전송
	// usr, adm 서블릿에서 각 컨트롤들이 요청 수행후 jspPath 리턴
	protected String doAction(HttpServletRequest request, HttpServletResponse response, String controllerName, String requestName) throws IOException{

		String jspPath = null;

		/*
		 * if (controllerName.equals("home")) { HomeController homeController =
		 * Container.homeController; jspPath = homeController.index(request, response);
		 * }
		 */
		if (controllerName.equals("upload")) {
			UploadController uploadController = Container.uploadController;
			if(requestName.equals("server")) {
				jspPath = uploadController.server(request, response);
			}
			
		}
		if (controllerName.equals("download")) {
			DownloadController downloadController = Container.downloadController;
			if(requestName.equals("server")) {
				jspPath = downloadController.server(request, response);
			}
		}

		return jspPath;

	}

}

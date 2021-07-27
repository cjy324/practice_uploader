package servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//각 서블릿의 중복되는 코드를 템플릿메서드 패턴으로 중복제거
public abstract class DispatcherServlet extends HttpServlet {

	// doGet 메서드 호출
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doHandle(request, response);
	}
	// doPost 메서드 호출
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doHandle(request, response);
	}
	public void doHandle(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// (1) request와 response들어오면 1차적으로 실행
		Map<String, Object> doBeforeActionRs = doBeforeAction(request, response);
		if (doBeforeActionRs == null) {
			return;
		}
		// (2) doBeforeActionRs의 결과로 도출된 controllerName, actionMethodName 가져와 usr, adm 서블릿으로 전송
		// usr, adm 서블릿에서 각 컨트롤들이 요청 수행후 jspPath 리턴
		String jspPath = doAction(request, response, (String) doBeforeActionRs.get("controllerName"), (String) doBeforeActionRs.get("requestName"));
		//System.out.println("최종 jspPath: " + jspPath);
		
		if (jspPath == null) {
			response.getWriter().append("jsp 정보가 없습니다.");
			return;
		}
		
		// (3) (1),(2)의 결과로 도출된 jspPath를 받고 forward 수행
		//doAfterAction(request, response, jspPath);
//		
//		RequestDispatcher rd = request.getRequestDispatcher(jspPath + ".jsp");
//		rd.forward(request, response);
		
	}

	// 인터셉터
	private Map<String, Object> doBeforeAction(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");

		// 요청된 uri의 정보를 가져오기
		String requestURI = request.getRequestURI();
		//System.out.println(requestURI);
		// 가져온 uri의 정보를 /기준으로 쪼개기
		String[] requestUriBits = requestURI.split("/");

		// 만약, requestURIBits.length가 5보다 작으면
		// 즉, localhost:8086/upload/usr/upload/server 와 같은 형식이 아니면 중지
		int minBitsCount = 5;

		if (requestUriBits.length < minBitsCount) {
			response.getWriter().append("잘못된 요청입니다.");
			return null;
		}
		
		String controllerName = requestUriBits[3]; // upload or download
		String requestName = requestUriBits[4]; // server
	
		//System.out.println(controllerName);

		Map<String, Object> rs = new HashMap<>();
		rs.put("controllerName", controllerName);
		rs.put("requestName", requestName);
		return rs;
	}

	protected abstract String doAction(HttpServletRequest request, HttpServletResponse response, String controllerName, String requestName) throws IOException;
	
	private void doAfterAction(HttpServletRequest request, HttpServletResponse response, String jspPath)
			throws ServletException, IOException {

//		// DB 서버 연결 종료
//		MysqlUtil.closeConnection();
//		RequestDispatcher rd = request.getRequestDispatcher("/" + jspPath + ".jsp");
//		
//		rd.forward(request, response);
	}
}

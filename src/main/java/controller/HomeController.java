package controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HomeController {

	// 홈 메인화면
	public String home(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("들어오긴 함???");
		return "usr/index";
	}
}

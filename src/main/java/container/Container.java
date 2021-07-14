package container;

import controller.HomeController;
import controller.UploadController;

public class Container {

	public static HomeController homeController;
	public static UploadController uploadController;

	static {
		homeController = new HomeController();
		uploadController = new UploadController();
	}
}

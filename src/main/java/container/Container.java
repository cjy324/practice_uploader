package container;

import controller.DownloadController;
import controller.HomeController;
import controller.UploadController;

public class Container {

	public static HomeController homeController;
	public static UploadController uploadController;
	public static DownloadController downloadController;

	static {
		homeController = new HomeController();
		uploadController = new UploadController();
		downloadController = new DownloadController();
	}
}


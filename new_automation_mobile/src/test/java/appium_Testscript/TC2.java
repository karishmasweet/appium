package appium_Testscript;

import org.testng.annotations.Test;

import appium_mobile.Base2;
import appium_page_factory.Addtocart;
import appium_page_factory.Chrome_launch;
import appium_page_factory.Detail_Page_Firstscreen;

public class TC2 extends Base2
{
//Test case 2 which is launch to google browser
	@Test
	public void secondscreen() throws InterruptedException
	 {
		Detail_Page_Firstscreen pf=new Detail_Page_Firstscreen(driver);
		pf.execute("karishma", "Argentina", "Female");
		
		Addtocart ad=new Addtocart(driver);
		ad.execute1();
		
		Chrome_launch ch=new Chrome_launch(driver);
		ch.execute2();
		
	 }

}
